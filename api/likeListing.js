import connectDB from "../config/db.js"
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

    // 1️⃣ Find the listing
    const listing = await Listing.findById(listingId)
    if (!listing) return res.status(404).json({ error: "Listing not found" })

    // 2️⃣ Increment likes
    listing.numberOfLikes = (listing.numberOfLikes || 0) + 1

    await listing.save()

    res.status(200).json({ message: "Listing liked successfully", listing })
  } catch (err) {
    console.error("LikeListing Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}