import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(6);
  const [searchName, setSearchName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://eventbook.runasp.net/api/Categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.data);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch {
      toast.error("Error fetching categories");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        PageIndex: pageIndex,
        PageSize: pageSize,
        SearchName: searchName,
        CategoryId: categoryId,
      });
      const res = await fetch(
        `https://eventbook.runasp.net/api/Events/with-status?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        if (pageIndex === 1) {
          setEvents(data.data.items);
        } else {
          setEvents((prev) => [...prev, ...data.data.items]);
        }
        setHasMore(data.data.items.length >= pageSize);
      } else {
        toast.error("Failed to fetch events");
      }
    } catch {
      toast.error("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, searchName, categoryId]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setPageIndex(1);
    setEvents([]);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    setPageIndex(1);
    setEvents([]);
  };
const navigate = useNavigate();
  const handleEventClick = (event) => {
      navigate(`/event/${event.id}`);
  };

  const handleBookEvent = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to book this event?");
    if (!confirm) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://eventbook.runasp.net/api/Bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, status: "Booked" }),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      if (res.ok) {
        toast.success("Event booked successfully!");
        setPageIndex(1);
        setEvents([]);
      } else {
        toast.error("Failed to book the event.");
      }
    } catch {
      toast.error("Error booking event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-6 md:px-12 lg:px-24">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-10 drop-shadow-md">
        Upcoming Events
      </h1>

      {/* Filters */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-12">
        <input
          type="text"
          placeholder="Search events..."
          value={searchName}
          onChange={handleSearchChange}
          className="flex-grow border border-indigo-300 rounded-md py-3 px-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <select
          id="category"
          value={categoryId}
          onChange={handleCategoryChange}
          className="w-full md:w-64 border border-indigo-300 rounded-md py-3 px-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
        <div
  key={event.id}
  onClick={() => handleEventClick(event)}
  className="bg-white hover:bg-indigo-50 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-indigo-200"
>
            <img
              src={event.imageUrl.replace("https://localhost:7014", "https://eventbook.runasp.net")}
              alt={event.name}
              className="w-full h-56 object-cover"
              loading="lazy"
            />
            <div className="p-6 space-y-3">
              <h2 className="text-2xl font-bold text-indigo-900 truncate text-center">{event.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-700 mt-2">
                <span>📍 {event.venue}</span>
                <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
              <p className="text-indigo-700 font-semibold text-lg">${event.price}</p>
              <p className="text-gray-700 font-medium">📂 Category: {event.categoryName}</p>
              </div>
              {event.isBooked > 0 ? (
                <p className="text-green-600 font-semibold mt-2">✅ Booked</p>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookEvent(event.id);
                  }}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-colors"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 transition"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
