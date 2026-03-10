import mongoose from "mongoose"

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  image: String,
  description: { type: String, required: true },
  price: { type: Number, required: true },
  whoCreated: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timePosted: { type: Date, default: Date.now },
  numberOfLikes: { type: Number, default: 0 }
})

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema)