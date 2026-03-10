import connectDB from "../config/db.js"
import Listing from "../models/Listing.js"
import User from "../models/User.js"
import authMiddleware from "../middleware/auth.js"

connectDB() // reuse cached DB connection

export default async function handler(req, res) {
  const { method } = req

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: "Listing ID is required" })

    // Find the listing
    const listing = await Listing.findById(id)
    if (!listing) return res.status(404).json({ error: "Listing not found" })

    // Default: user not logged in
    let userData = { saved: false }

    // If user has a token, check if this listing is saved by the user
    if (req.headers.authorization?.startsWith("Bearer ")) {
      await new Promise((resolve, reject) => {
        authMiddleware(req, res, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      const user = await User.findById(req.user.id)
      if (user && user.saved.includes(listing._id)) {
        userData.saved = true
      }
    }

    res.status(200).json({
      listing,
      userData
    })
  } catch (err) {
    console.error("ListingDetail Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}