import connectDB from "../config/db.js"
import Listing from "../models/Listing.js"
import authMiddleware from "../middleware/auth.js"

connectDB()

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" })

  // Run auth middleware manually
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  try {
    const listings = await Listing.find().sort({ timePosted: -1 })
    res.status(200).json({ listings })
  } catch (err) {
    console.error("ListListings Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}