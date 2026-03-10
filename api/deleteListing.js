import connectDB from "../config/db.js"
import Listing from "../models/Listing.js"
import authMiddleware from "../middleware/auth.js"

connectDB()

export default async function handler(req, res) {
  const { method } = req

  if (method !== "DELETE") {
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

    // 2️⃣ Check ownership
    if (listing.whoCreated.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not allowed to delete this listing" })
    }

    // 3️⃣ Delete listing
    await Listing.findByIdAndDelete(listingId)

    res.status(200).json({ message: "Listing deleted successfully" })
  } catch (err) {
    console.error("DeleteListing Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}