const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categories: { type: [String], required: true },
  availability: { type: Boolean, default: true }
});

const Plant = mongoose.model('Plant', plantSchema);

// Get all plants or search/filter
app.get('/plants', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { categories: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    const plants = await Plant.find(query);
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new plant
app.post('/plants', async (req, res) => {
  try {
    const { name, price, categories, availability } = req.body;
    if (!name || !price || !categories || categories.length === 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const newPlant = new Plant({ name, price, categories, availability });
    await newPlant.save();
    res.json(newPlant);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));