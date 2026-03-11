// pages/api/register.js

import connectDB from "../config/db";
import User from "../models/User";
import bcrypt from "bcrypt";
import cors from "cors";
app.use(cors());
// Connect to MongoDB once globally
connectDB();

export default async function handler(req, res) {
  try {
    // ---------------- CORS ----------------
    const allowedOrigins = [
      "http://localhost:5173",
     
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      // Optional: for testing allow all origins
      res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle preflight request
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    // --------------------------------------

    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      lastLogin: new Date(),
      saved: []
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}