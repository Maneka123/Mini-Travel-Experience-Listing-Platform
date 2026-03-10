import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";
import authMiddleware from "../middleware/auth.js";

connectDB();

export default async function handler(req, res) {
  // ✅ Always set CORS first
  const allowedOrigins = [
    "http://localhost:3000",
    "https://travel-app-frontend-phi.vercel.app",
    "https://mini-travel-app-frontend.vercel.app"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  // ✅ Handle preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    // ✅ Auth check
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) {
          // Return 401 instead of crashing
          res.status(401).json({ error: "Unauthorized" });
          return reject(err);
        } else resolve();
      });
    });

    const listings = await Listing.find().sort({ timePosted: -1 });
    res.status(200).json({ listings });

  } catch (err) {
    console.error("Listings Error:", err);
    // If headers were already sent by authMiddleware, this won't break
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error" });
    }
  }
}