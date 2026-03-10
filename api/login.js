require("dotenv").config()
const connectDB = require("../config/db")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Connect to MongoDB once
connectDB()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // 1️⃣ Find user by email
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: "Invalid credentials" })

    // 2️⃣ Compare password
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(400).json({ error: "Invalid credentials" })

    // 3️⃣ Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 4️⃣ Update last login
    user.lastLogin = new Date()
    await user.save()

    // 5️⃣ Set cookie (httpOnly)
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${7*24*60*60}`)

    res.status(200).json({ message: "Login successful", token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}