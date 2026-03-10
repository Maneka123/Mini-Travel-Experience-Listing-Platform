import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";
import authMiddleware from "../middleware/auth.js";

connectDB();

export default async function handler(req, res) {
  const allowedOrigin = "https://travel-app-frontend-phi.vercel.app";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { mine } = req.query;

    if (mine === "true") {
      await new Promise((resolve, reject) => {
        authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
      });
      const userListings = await Listing.find({ whoCreated: req.user.id });
      return res.status(200).json({ listings: userListings });
    }

    const allListings = await Listing.find();
    return res.status(200).json({ listings: allListings });
  } catch (err) {
    console.error("GetListing Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}