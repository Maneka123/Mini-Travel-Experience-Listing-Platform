import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";
import authMiddleware from "../middleware/auth.js";

connectDB();

export default async function handler(req, res) {

  // ✅ CORS FIX
  const allowedOrigins = [
    "http://localhost:3000",
    "https://mini-travel-app-frontend.vercel.app"
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    // ✅ Run auth middleware
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const listings = await Listing.find().sort({ timePosted: -1 });

    res.status(200).json({ listings });

  } catch (err) {
    console.error("ListListings Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}