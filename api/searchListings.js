import connectDB from "../config/db.js"
import Listing from "../models/Listing.js"

connectDB() // call outside handler to reuse connection

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { q } = req.query
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" })

    const regex = new RegExp(q, "i")

    const listings = await Listing.find({
      $or: [
        { title: regex },
        { location: regex },
        { description: regex }
      ]
    }).sort({ timePosted: -1 })

    res.status(200).json({ listings })
  } catch (err) {
    console.error("SearchListings Error:", err)
    res.status(500).json({ error: "Server error" })
  }
}