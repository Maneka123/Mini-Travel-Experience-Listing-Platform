require("dotenv").config()
const express = require("express")
const connectDB = require("../config/db")

const app = express()

app.use(express.json())

// Connect to MongoDB
connectDB()

app.get("/", (req, res) => {
  res.json({ message: "Travel API running" })
})

module.exports = app