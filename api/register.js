require("dotenv").config()           // must be first
const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const connectDB = require("../config/db")

const app = express()

app.use(express.json())

// Connect to MongoDB
connectDB()

// REGISTER endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1️⃣ Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    // 3️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      lastLogin: new Date(),
      saved: []
    })

    // 5️⃣ Send success response (safe!)
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
})

module.exports = app