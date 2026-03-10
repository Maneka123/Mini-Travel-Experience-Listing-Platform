// api/getListings.js
import connectDB from "../config/db.js"
import Listing from "../models/Listing.js"
import authMiddleware from "../middleware/auth.js"

connectDB() // reuse cached DB connection

export default async function handler(req, res) {
  const { method, query } = req

  try {
    if (method === "GET") {
      const { mine } = query // ?mine=true for logged-in user's listings

      if (mine === "true") {
        // Require authentication
        await new Promise((resolve, reject) => {
          authMiddleware(req, res, (err) => (err ? reject(err) : resolve()))
        })

        // Fetch listings by logged-in user
        const userListings = await Listing.find({ whoCreated: req.user.id })
        return res.status(200).json({ listings: userListings })
      } else {
        // Fetch all listings
        const allListings = await Listing.find()
        return res.status(200).json({ listings: allListings })
      }
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error("GetListings Error:", err)
    return res.status(500).json({ error: "Server error" })
  }
}