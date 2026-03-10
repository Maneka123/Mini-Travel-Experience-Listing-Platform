import connectDB from "../config/db.js"
import User from "../models/User.js"
import Listing from "../models/Listing.js"
import authMiddleware from "../middleware/auth.js"

connectDB() // reuse cached DB connection

export default async function handler(req, res) {
  const { method } = req

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Run auth middleware manually
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  try {
    // Get the user
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    // Populate saved listings
    const savedListings = await Listing.find({ _id: { $in: user.saved } }).sort({ timePosted: -1 })

    res.status(200).json({ savedListings })
  } catch (err) {
    console.error("SavedListings Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}