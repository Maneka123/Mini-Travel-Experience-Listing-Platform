const mongoose = require("mongoose")

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String // URL of image
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  whoCreated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  timePosted: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model("Listing", listingSchema)