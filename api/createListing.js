import authMiddleware from "../middleware/auth.js";
import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";

export default async function handler(req, res) {
  // ----------- CORS Headers -----------
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();

    // ✅ Run auth middleware
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Please login first." });
    }

    const { title, location, image, description, price } = req.body;

    if (!title || !location || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newListing = await Listing.create({
      title,
      location,
      image: image || "",
      description,
      price,
      whoCreated: req.user.id,
      timePosted: new Date(),
      numberOfLikes: 0,
    });

    return res.status(201).json({ message: "Listing created successfully", listing: newListing });

  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}