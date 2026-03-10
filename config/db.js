const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables")
    }

    // Mongoose 7+ does not need options
    await mongoose.connect(process.env.MONGO_URI)

    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}

module.exports = connectDB