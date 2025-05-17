import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const BookingsIndex = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [eventId, setEventId] = useState(""); // Optional filter
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    toast.dismiss();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        PageIndex: pageIndex,
        PageSize: pageSize,
      });

      if (eventId) {
        params.append("EventId", eventId);
      }

      const res = await fetch(`https://eventbook.runasp.net/api/Bookings?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
          
      const result = await res.json();
             console.log(res)
      if (!res.ok) throw new Error(result.message || "Failed to fetch bookings");

      setBookings(result.data.items || []);
      setTotalPages(result.data.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pageIndex, pageSize, eventId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">My Bookings</h1>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm mb-1 text-gray-600">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 border rounded-md"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 mt-10">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-5 rounded-xl shadow border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-indigo-800">{booking.eventName}</h2>
              <p className="text-gray-600 mt-1">
                <strong>Date:</strong>{" "}
                {new Date(booking.eventDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Venue:</strong> {booking.venue}
              </p>
              <p className="text-gray-600">
                <strong>Price:</strong> ${booking.price}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> ✅ Booked
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
          disabled={pageIndex === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {pageIndex} of {totalPages}
        </span>
        <button
          onClick={() => setPageIndex((p) => p + 1)}
          disabled={pageIndex >= totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingsIndex;
