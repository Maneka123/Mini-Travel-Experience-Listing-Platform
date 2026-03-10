const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date
  },
  saved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing"
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)