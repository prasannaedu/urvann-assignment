// backend/models/Plant.js
import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categories: { type: [String], required: true },
  availability: { type: Boolean, default: true },
  imageUrl: { type: String },
});

export default mongoose.model("Plant", plantSchema);
