// api/manageSavedListings.js
import connectDB from "../config/db.js"
import User from "../models/User.js"
import Listing from "../models/Listing.js"
import authMiddleware from "../middleware/auth.js"

connectDB() // reuse cached DB connection

export default async function handler(req, res) {
  const { method } = req

  // Run auth middleware for all actions except GET (optional)
  await new Promise((resolve, reject) => {
    if (method !== "GET") {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()))
    } else {
      resolve()
    }
  })

  try {
    if (method === "POST") {
      // Save or remove a listing
      const { listingId, action } = req.body
      if (!listingId) return res.status(400).json({ error: "listingId is required" })
      if (!["save", "remove"].includes(action))
        return res.status(400).json({ error: 'action must be "save" or "remove"' })

      const user = await User.findById(req.user.id)
      if (!user) return res.status(404).json({ error: "User not found" })

      if (action === "save") {
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
    }

    if (method === "GET") {
      // Get all saved listings for the logged-in user
      await new Promise((resolve, reject) => {
        authMiddleware(req, res, (err) => (err ? reject(err) : resolve()))
      })

      const user = await User.findById(req.user.id).populate("saved") // populate saved listings
      if (!user) return res.status(404).json({ error: "User not found" })

      const listings = await Listing.find({ _id: { $in: user.saved } })
      return res.status(200).json({ savedListings: listings })
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error("ManageSavedListings Error:", err)
    return res.status(500).json({ error: "Server error" })
  }
}