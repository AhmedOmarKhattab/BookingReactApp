import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const EditEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    eventDate: "",
    price: "",
    venue: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://eventbook.runasp.net/api/Categories");
        const data = await res.json();
        if (res.ok && data.success !== false) {
          setCategories(data.data);
        } else {
          toast.error("Failed to load categories");
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };

    // Fetch event data to prefill form
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://eventbook.runasp.net/api/Events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const ev = data.data;
          setForm({
            name: ev.name || "",
            description: ev.description || "",
            categoryId: ev.categoryId?.toString() || "",
            // Format date to yyyy-MM-dd for input type="date"
            eventDate: ev.eventDate
              ? new Date(ev.eventDate).toISOString().substring(0, 10)
              : "",
            price: ev.price || "",
            venue: ev.venue || "",
          });
        } else {
          toast.error("Failed to load event details");
        }
      } catch {
        toast.error("Error fetching event details");
      } finally {
        setLoadingData(false);
      }
    };

    fetchCategories();
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);

    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    if (image) formData.append("Image", image);

    try {
      const res = await fetch(`https://eventbook.runasp.net/api/Events/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || result.success !== true) {
        throw new Error(result.message || "Failed to update event");
      }

      toast.success("Event updated successfully!");
      navigate("/admin/events");
    } catch (error) {
      toast.error(error.message || "Error updating event");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading event data...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl space-y-6"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-semibold text-center">Edit Event</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Event Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3 border rounded"
          />
          <input
            name="venue"
            placeholder="Venue"
            value={form.venue}
            onChange={handleChange}
            required
            className="p-3 border rounded"
          />
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            required
            className="p-3 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="p-3 border rounded"
          />
        </div>

        <textarea
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        {/* Category Select */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEventForm;
