const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables")
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1) // stop the app if DB fails
  }
}

module.exports = connectDB