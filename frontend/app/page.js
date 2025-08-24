"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "indoor", "outdoor", "succulent", "air purifying", "home decor",
    "flowering", "low maintenance", "medicinal", "trailing", "bonsai",
    "hanging", "fragrant", "ground cover", "climber", "annual",
    "herb", "vegetable", "colorful foliage"
  ];

  useEffect(() => {
    fetchPlants();
  }, [search, category]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/plants?search=${search}&category=${category.toLowerCase()}`
      );
      setPlants(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load plants");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🌱 Mini Plant Store</h1>

      {/* --- Search + Filter --- */}
      <div className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-2 md:mb-0 md:mr-2 flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 flex-1"
        >
          <option value="">Filter by Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* --- Plant List --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {plants.map((plant) => (
          <div key={plant._id} className="border p-4 rounded shadow hover:shadow-lg transition">
            {plant.imageUrl && (
              <img
                src={`${API}${plant.imageUrl}`}  
                alt={plant.name}
                className="w-full h-48 object-cover mb-2 rounded"
              />
            )}
            <h2 className="text-xl font-semibold">{plant.name}</h2>
            <p>Price: ₹{plant.price}</p>
            <p>Categories: {plant.categories.join(", ")}</p>
            <p>Availability: {plant.availability ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
