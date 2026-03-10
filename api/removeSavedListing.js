import connectDB from "../config/db.js"
import User from "../models/User.js"
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

    // Find the user
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    // Remove the listingId from saved array
    user.saved = user.saved.filter(id => id.toString() !== listingId)
    await user.save()

    res.status(200).json({ message: "Listing removed from saved successfully", saved: user.saved })
  } catch (err) {
    console.error("RemoveSavedListing Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}