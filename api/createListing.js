import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";
import authMiddleware from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import formidable from "formidable";

// Disable default body parser for file uploads
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // ---------- CORS ----------
  const allowedOrigins = [
    "http://localhost:5173",
    "https://mini-travel-app-frontend.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // ----------------------------

  try {
    await connectDB();

    // Run auth middleware
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Parse multipart form data
    const data = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { title, location, description, price } = data.fields;
    const imageFile = data.files?.image;

    if (!title || !location || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Upload image to Cloudinary if provided
    let imageUrl = "";
    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: "travel_listings",
      });
      imageUrl = result.secure_url;
    }

    // Create listing
    const newListing = await Listing.create({
      title,
      location,
      description,
      price: Number(price),
      image: imageUrl,
      whoCreated: req.user.id,
      timePosted: new Date(),
      numberOfLikes: 0,
    });

    return res
      .status(201)
      .json({ message: "Listing created successfully", listing: newListing });
  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}