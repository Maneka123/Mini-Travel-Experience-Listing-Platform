import authMiddleware from "../middleware/auth.js";
import connectDB from "../config/db.js";
import Listing from "../models/Listing.js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

connectDB();

export default async function handler(req, res) {
  const allowedOrigin = "https://travel-app-frontend-phi.vercel.app";

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.status(200).end();
  }

  // Set headers for actual request
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

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

  // Parse multipart/form-data
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "/public/uploads"); // save uploaded files here
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error parsing files" });
    }

    const { title, location, description, price } = fields;
    const imageFile = files.image;

    if (!title || !location || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imagePath = "";
    if (imageFile) {
      // Rename/move file if needed
      const oldPath = imageFile.filepath || imageFile.path;
      const fileName = `${Date.now()}-${imageFile.originalFilename}`;
      const newPath = path.join(process.cwd(), "/public/uploads", fileName);
      fs.renameSync(oldPath, newPath);
      imagePath = `/uploads/${fileName}`; // URL accessible from frontend
    }

    try {
      const newListing = await Listing.create({
        title,
        location,
        image: imagePath,
        description,
        price,
        whoCreated: req.user.id,
        timePosted: new Date(),
        numberOfLikes: 0,
      });

      res.status(201).json({
        message: "Listing created successfully",
        listing: newListing,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
}