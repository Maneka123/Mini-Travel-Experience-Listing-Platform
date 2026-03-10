import authMiddleware from "../middleware/auth.js"
import connectDB from "../config/db.js"
import Listing from "../models/Listing.js"

// Connect to MongoDB
connectDB()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // 1️⃣ Run auth middleware manually
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  try {
    const { title, location, image, description, price } = req.body

    // 2️⃣ Validate inputs
    if (!title || !location || !description || !price) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // 3️⃣ Create new listing
    const newListing = await Listing.create({
      title,
      location,
      image: image || "",          // optional
      description,
      price,
      whoCreated: req.user.id,
      timePosted: new Date(),
      numberOfLikes: 0
    })

    res.status(201).json({
      message: "Listing created successfully",
      listing: newListing
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}