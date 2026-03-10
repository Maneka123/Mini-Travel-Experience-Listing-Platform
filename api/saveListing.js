import connectDB from "../config/db.js"
import User from "../models/User.js"
import Listing from "../models/Listing.js"
import authMiddleware from "../middleware/auth.js"

connectDB() // reuse cached DB connection

export default async function handler(req, res) {
  const { method } = req

  if (method !== "POST") {
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
    const { listingId } = req.body

    if (!listingId) return res.status(400).json({ error: "listingId is required" })

    // Check if listing exists
    const listing = await Listing.findById(listingId)
    if (!listing) return res.status(404).json({ error: "Listing not found" })

    // Find the user
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    // Add listingId to saved array if not already there
    if (!user.saved.includes(listingId)) {
      user.saved.push(listingId)
      await user.save()
    }

    res.status(200).json({ message: "Listing saved successfully", saved: user.saved })
  } catch (err) {
    console.error("SaveListing Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}