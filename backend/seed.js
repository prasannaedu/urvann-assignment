 
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected for seeding');
    const Plant = mongoose.model('Plant', new mongoose.Schema({
      name: String,
      price: Number,
      categories: [String],
      availability: Boolean
    }));

    const plants = [
      { name: 'Money Plant', price: 99, categories: ['Indoor', 'Air Purifying', 'Home Decor'], availability: true },
      { name: 'Snake Plant', price: 149, categories: ['Indoor', 'Low Maintenance', 'Air Purifying'], availability: true },
      { name: 'Peace Lily', price: 199, categories: ['Indoor', 'Flowering', 'Air Purifying'], availability: true },
      { name: 'Jade Plant', price: 109, categories: ['Succulent', 'Indoor', 'Low Maintenance'], availability: true },
      { name: 'Spider Plant', price: 189, categories: ['Indoor', 'Air Purifying', 'Home Decor'], availability: true },
      { name: 'Aloe Vera', price: 79, categories: ['Succulent', 'Indoor', 'Medicinal'], availability: true },
      { name: 'Bamboo Plant', price: 129, categories: ['Indoor', 'Outdoor', 'Home Decor'], availability: true },
      { name: 'ZZ Plant', price: 159, categories: ['Indoor', 'Low Maintenance'], availability: true },
      { name: 'Pothos', price: 89, categories: ['Indoor', 'Trailing', 'Air Purifying'], availability: true },
      { name: 'Rubber Plant', price: 249, categories: ['Indoor', 'Air Purifying'], availability: true },
      { name: 'Ficus Bonsai', price: 299, categories: ['Indoor', 'Bonsai', 'Home Decor'], availability: true },
      { name: 'Areca Palm', price: 199, categories: ['Indoor', 'Outdoor', 'Air Purifying'], availability: true },
      { name: 'Boston Fern', price: 139, categories: ['Indoor', 'Hanging', 'Air Purifying'], availability: true },
      { name: 'Philodendron', price: 119, categories: ['Indoor', 'Trailing'], availability: true },
      { name: 'Dracaena', price: 179, categories: ['Indoor', 'Low Maintenance'], availability: true },
      { name: 'Syngonium', price: 99, categories: ['Indoor', 'Air Purifying'], availability: true },
      { name: 'Cactus Mix', price: 59, categories: ['Succulent', 'Indoor', 'Low Maintenance'], availability: true },
      { name: 'Succulent Pack', price: 199, categories: ['Succulent', 'Indoor'], availability: true },
      { name: 'Rose Bush', price: 149, categories: ['Outdoor', 'Flowering'], availability: true },
      { name: 'Hibiscus', price: 129, categories: ['Outdoor', 'Flowering'], availability: true },
      { name: 'Mogra (Jasmine)', price: 99, categories: ['Outdoor', 'Flowering', 'Fragrant'], availability: true },
      { name: 'Ixora', price: 109, categories: ['Outdoor', 'Flowering'], availability: true },
      { name: 'Periwinkle', price: 79, categories: ['Outdoor', 'Flowering', 'Ground Cover'], availability: true },
      { name: 'Aparajita (Butterfly Pea)', price: 89, categories: ['Outdoor', 'Climber', 'Flowering'], availability: true },
      { name: 'Kaner (Oleander)', price: 119, categories: ['Outdoor', 'Flowering'], availability: true },
      { name: 'Chrysanthemum', price: 99, categories: ['Outdoor', 'Flowering'], availability: true },
      { name: 'Marigold', price: 49, categories: ['Outdoor', 'Flowering', 'Annual'], availability: true },
      { name: 'Petunia', price: 69, categories: ['Outdoor', 'Flowering', 'Hanging'], availability: true },
      { name: 'Lavender', price: 139, categories: ['Outdoor', 'Fragrant', 'Herb'], availability: true },
      { name: 'Basil (Tulsi)', price: 59, categories: ['Outdoor', 'Herb', 'Medicinal'], availability: true },
      { name: 'Mint', price: 49, categories: ['Outdoor', 'Herb'], availability: true },
      { name: 'Lemon Grass', price: 79, categories: ['Outdoor', 'Herb'], availability: true },
      { name: 'Curry Leaf', price: 89, categories: ['Outdoor', 'Herb'], availability: true },
      { name: 'Tomato Plant', price: 59, categories: ['Outdoor', 'Vegetable'], availability: true },
      { name: 'Chilli Plant', price: 49, categories: ['Outdoor', 'Vegetable'], availability: true },
      { name: 'Eggplant', price: 69, categories: ['Outdoor', 'Vegetable'], availability: true },
      { name: 'Schefflera', price: 159, categories: ['Indoor', 'Air Purifying'], availability: true },
      { name: 'Croton', price: 129, categories: ['Indoor', 'Colorful Foliage'], availability: true },
      { name: 'Dieffenbachia', price: 149, categories: ['Indoor'], availability: true },
      { name: 'Aglaonema', price: 179, categories: ['Indoor', 'Low Maintenance'], availability: true },
      { name: 'Anthurium', price: 199, categories: ['Indoor', 'Flowering'], availability: true },
      { name: 'African Violet', price: 99, categories: ['Indoor', 'Flowering'], availability: true },
      { name: 'Orchid', price: 249, categories: ['Indoor', 'Flowering'], availability: true },
      { name: 'Bird of Paradise', price: 299, categories: ['Indoor', 'Outdoor'], availability: true },
      { name: 'Yucca', price: 189, categories: ['Indoor', 'Low Maintenance'], availability: true },
      { name: 'Palm Mix', price: 219, categories: ['Indoor', 'Outdoor'], availability: true },
      { name: 'Ferns Pack', price: 159, categories: ['Indoor', 'Hanging'], availability: true },
      { name: 'Calathea', price: 139, categories: ['Indoor', 'Air Purifying'], availability: true },
      { name: 'Monstera', price: 229, categories: ['Indoor', 'Trailing'], availability: true },
      { name: 'Fittonia', price: 89, categories: ['Indoor', 'Ground Cover'], availability: true }
    ];

    await Plant.insertMany(plants);
    console.log('50 plants seeded');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));