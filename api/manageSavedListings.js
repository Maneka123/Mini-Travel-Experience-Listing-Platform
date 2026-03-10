// api/manageSavedListings.js
import connectDB from "../config/db.js"
import User from "../models/User.js"
import Listing from "../models/Listing.js"
import authMiddleware from "../middleware/auth.js"

connectDB() // reuse cached DB connection

export default async function handler(req, res) {
  const { method } = req
  if (method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  // Run auth middleware manually
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => (err ? reject(err) : resolve()))
  })

  try {
    const { listingId, action } = req.body // action: "save" or "remove"
    if (!listingId) return res.status(400).json({ error: "listingId is required" })
    if (!["save", "remove"].includes(action))
      return res.status(400).json({ error: 'action must be "save" or "remove"' })

    // Find the user
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    if (action === "save") {
      // Check if listing exists
      const listing = await Listing.findById(listingId)
      if (!listing) return res.status(404).json({ error: "Listing not found" })

      if (!user.saved.includes(listingId)) {
        user.saved.push(listingId)
        await user.save()
      }
      return res
        .status(200)
        .json({ message: "Listing saved successfully", saved: user.saved })
    }

    if (action === "remove") {
      user.saved = user.saved.filter(id => id.toString() !== listingId)
      await user.save()
      return res
        .status(200)
        .json({ message: "Listing removed from saved successfully", saved: user.saved })
    }
  } catch (err) {
    console.error("ManageSavedListings Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}