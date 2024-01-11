const mongoose = require("mongoose");

const PostModel = new mongoose.Schema({
  postId: { type: Number, required: true, unique: true },
  propertyImage: [{ data: Buffer, contentType: String }],
  propertyType: { type: String, required: true },
  propertyArea: { type: String, required: true },
  area: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true },
  bedrooms: Number,
  bathrooms: Number,
  furnishing: { type: String, required: true },
  floors: Number,
  facing: { type: String, required: true },
  swimming: String,
  listingfor: { type: String, required: true },
  listedby: { type: String, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: String,
  whatsApp: String,
  communication: String,
  listingtenure: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Post = mongoose.model("Post", PostModel);

module.exports = Post;
