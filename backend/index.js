// backend/index.js
// CommonJS (no ESM warning). Run with: node index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// ---------- CORS (dev-friendly) ----------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // add your LAN IP if you open from phone/another PC, e.g.
      "http://10.13.0.137:3000",
    ],
    credentials: false,
  })
);

// ---------- JSON parsing ----------
app.use(express.json());

// ---------- Ensure /uploads exists & serve it ----------
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR)); // e.g. http://localhost:5000/uploads/<file>

// ---------- Mongo Connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ---------- Mongoose Model ----------
const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    categories: { type: [String], default: [] },
    availability: { type: Boolean, default: true },
    imageUrl: { type: String }, // stored as "uploads/<filename>"
  },
  { timestamps: true }
);

const Plant = mongoose.model("Plant", plantSchema);

// ---------- Multer Storage (disk) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ---------- Routes ----------

// GET /plants  (with search & category filter)
app.get("/plants", async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { categories: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    if (category) {
      query.categories = { $in: [category.toLowerCase()] };
    }

    const plants = await Plant.find(query).sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /plants  (multipart: image + fields)
app.post("/plants", upload.single("image"), async (req, res) => {
  try {
    const { name, price, categories = "", availability } = req.body;

    if (!name || price === undefined || categories === "") {
      return res.status(400).json({ error: "name, price, categories required" });
    }

    const catArray = categories
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    const doc = new Plant({
      name: String(name).trim(),
      price: Number(price),
      categories: catArray,
      availability: availability === "true" || availability === true,
      imageUrl: req.file ? `uploads/${req.file.filename}` : undefined,
    });

    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add plant" });
  }
});

// PUT /plants/:id  (multipart: optional new image)
app.put("/plants/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, categories = "", availability } = req.body;

    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (price !== undefined) update.price = Number(price);
    if (categories !== undefined) {
      update.categories = categories
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean);
    }
    if (availability !== undefined) {
      update.availability = availability === "true" || availability === true;
    }
    if (req.file) {
      update.imageUrl = `uploads/${req.file.filename}`;
    }

    // If new image uploaded, optionally delete old image from disk
    if (req.file) {
      const prev = await Plant.findById(req.params.id);
      if (prev?.imageUrl) {
        const oldPath = path.join(__dirname, prev.imageUrl);
        fs.existsSync(oldPath) && fs.unlink(oldPath, () => {});
      }
    }

    const updated = await Plant.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Plant not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update plant" });
  }
});

// DELETE /plants/:id  (also remove image from disk)
app.delete("/plants/:id", async (req, res) => {
  try {
    const doc = await Plant.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Plant not found" });

    if (doc.imageUrl) {
      const f = path.join(__dirname, doc.imageUrl);
      fs.existsSync(f) && fs.unlink(f, () => {});
    }

    res.json({ message: "Plant deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete plant" });
  }
});

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
