// backend/fixImages.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const plantSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
});
const Plant = mongoose.model("Plant", plantSchema);

async function fixImages() {
  await mongoose.connect(process.env.MONGO_URI);

  const plants = await Plant.find({});
  for (let p of plants) {
    if (p.imageUrl && !p.imageUrl.startsWith("/")) {
      p.imageUrl = "/" + p.imageUrl;
      await p.save();
      console.log(`✅ Fixed: ${p.name}`);
    }
  }

  console.log("🎉 All old image paths updated!");
  process.exit();
}

fixImages();
