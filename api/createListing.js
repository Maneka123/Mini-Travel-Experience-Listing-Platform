import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";
import authMiddleware from "../middleware/auth.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "travel_listings",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // important: disable default body parser for file upload
  },
};

const handler = async (req, res) => {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();

    // Wrap auth middleware in promise
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Use multer to parse form-data
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });

      const { title, location, description, price } = req.body;
      const imageUrl = req.file?.path || ""; // Cloudinary URL

      if (!title || !location || !description || !price)
        return res.status(400).json({ error: "All fields are required" });

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

      return res.status(201).json({ message: "Listing created successfully", listing: newListing });
    });
  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

export default handler;