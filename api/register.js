require("dotenv").config()
const connectDB = require("../config/db")
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Connect to MongoDB once
connectDB()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      passwordHash,
      lastLogin: new Date(),
      saved: []
    })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}