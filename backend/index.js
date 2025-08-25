// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// ---------- CORS ----------
const FRONTEND_URL = "https://urvann-assignment-ui8k.vercel.app"; // Deployed frontend URL

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman or server-to-server requests
      if (origin === "http://localhost:3000" || origin === FRONTEND_URL) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ---------- JSON parsing ----------
app.use(express.json());

// ---------- Ensure /uploads exists & serve it ----------
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR)); // serve images

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
    imageUrl: { type: String }, // stored as "/uploads/<filename>"
  },
  { timestamps: true }
);

const Plant = mongoose.model("Plant", plantSchema);

// ---------- Multer Storage ----------
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

// GET /plants
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

    // Fix old image paths
    const fixedPlants = plants.map((p) => {
      if (p.imageUrl && !p.imageUrl.startsWith("/")) {
        p.imageUrl = `/${p.imageUrl}`;
      }
      return p;
    });

    res.json(fixedPlants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /plants
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
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add plant" });
  }
});

// PUT /plants/:id
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
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;

    // Remove old image if replaced
    if (req.file) {
      const prev = await Plant.findById(req.params.id);
      if (prev?.imageUrl) {
        const oldPath = path.join(__dirname, prev.imageUrl.replace(/^\//, ""));
        fs.existsSync(oldPath) && fs.unlink(oldPath, () => {});
      }
    }

    const updated = await Plant.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: "Plant not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update plant" });
  }
});

// DELETE /plants/:id
app.delete("/plants/:id", async (req, res) => {
  try {
    const doc = await Plant.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Plant not found" });

    if (doc.imageUrl) {
      const f = path.join(__dirname, doc.imageUrl.replace(/^\//, ""));
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
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
