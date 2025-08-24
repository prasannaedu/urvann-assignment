"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [availability, setAvailability] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all plants
  const fetchPlants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/plants");
      setPlants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  // Handle Form Submit (Add / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !categories) {
      setError("All fields required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("categories", categories);
      formData.append("availability", availability);
      if (file) formData.append("image", file);

      if (editId) {
        // Edit Plant
        await axios.put(`http://localhost:5000/plants/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Plant updated!");
      } else {
        // Add Plant
        await axios.post("http://localhost:5000/plants", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Plant added!");
      }

      resetForm();
      fetchPlants();
    } catch (err) {
      console.error(err);
      setError("Failed to save plant");
    }
  };

  // Handle Edit
  const handleEdit = (plant) => {
    setEditId(plant._id);
    setName(plant.name);
    setPrice(plant.price);
    setCategories(plant.categories.join(", "));
    setAvailability(plant.availability);
    setPreview(plant.imageUrl ? `http://localhost:5000/${plant.imageUrl}` : null);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;
    try {
      await axios.delete(`http://localhost:5000/plants/${id}`);
      fetchPlants();
    } catch (err) {
      console.error(err);
    }
  };

  // File Change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setCategories("");
    setAvailability(true);
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🌿 Admin Dashboard</h1>

      {/* --- Dashboard Summary --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded shadow text-center">
          <h3 className="text-lg font-bold">Total</h3>
          <p className="text-2xl">{plants.length}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded shadow text-center">
          <h3 className="text-lg font-bold">Available</h3>
          <p className="text-2xl">{plants.filter(p => p.availability).length}</p>
        </div>
        <div className="p-4 bg-red-100 rounded shadow text-center">
          <h3 className="text-lg font-bold">Unavailable</h3>
          <p className="text-2xl">{plants.filter(p => !p.availability).length}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow text-center">
          <h3 className="text-lg font-bold">Categories</h3>
          <p className="text-2xl">
            {[...new Set(plants.flatMap(p => p.categories))].length}
          </p>
        </div>
      </div>

      {/* --- Add/Edit Form --- */}
      <form onSubmit={handleSubmit} className="flex flex-col max-w-md mb-6">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 mb-2"
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover mb-2 rounded"
          />
        )}
        <label className="mb-2">
          Available:
          <input
            type="checkbox"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
            className="ml-2"
          />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editId ? "Update Plant" : "Add Plant"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* --- Plant List --- */}
      <h2 className="text-2xl font-bold mb-4">Manage Plants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <div key={plant._id} className="border p-4 rounded shadow">
            {plant.imageUrl && (
              <img
                src={`http://localhost:5000/${plant.imageUrl}`}
                alt={plant.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <h3 className="text-lg font-semibold">{plant.name}</h3>
            <p>₹{plant.price}</p>
            <p>Categories: {plant.categories.join(", ")}</p>
            <p>Availability: {plant.availability ? "Yes" : "No"}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(plant)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(plant._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
