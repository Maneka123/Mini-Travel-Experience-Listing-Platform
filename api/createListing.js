import authMiddleware from "../middleware/auth.js";
import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";

// Connect to MongoDB once
connectDB();

export default async function handler(req, res) {
  try {
    // ----------- CORS headers -----------
    const allowedOrigins = [
      "http://localhost:5173", // local dev
      "https://mini-travel-app-frontend.vercel.app", // your deployed frontend
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*"); // optional fallback
    }

    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    // -------------------------------------

    // Only POST allowed
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Run auth middleware
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Extract JSON body
    const { title, location, image, description, price } = req.body;

    // Validate fields
    if (!title || !location || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create listing in DB
    const newListing = await Listing.create({
      title,
      location,
      image: image || "", // keep optional
      description,
      price,
      whoCreated: req.user.id,
      timePosted: new Date(),
      numberOfLikes: 0,
    });

    return res.status(201).json({
      message: "Listing created successfully",
      listing: newListing,
    });

  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}