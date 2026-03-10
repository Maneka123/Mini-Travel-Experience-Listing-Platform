// api/getListing.js
import connectDB from "../config/db.js"
import Listing from "../models/Listing.js"
import User from "../models/User.js"
import authMiddleware from "../middleware/auth.js"

connectDB()

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" })

  const { id } = req.query
  if (!id) return res.status(400).json({ error: "Listing ID is required" })

  try {
    const listing = await Listing.findById(id)
    if (!listing) return res.status(404).json({ error: "Listing not found" })

    let userData = { saved: false }

    if (req.headers.authorization?.startsWith("Bearer ")) {
      await new Promise((resolve, reject) =>
        authMiddleware(req, res, (err) => (err ? reject(err) : resolve()))
      )
      const user = await User.findById(req.user.id)
      if (user && user.saved.includes(listing._id)) userData.saved = true
    }

    res.status(200).json({ listing, userData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}