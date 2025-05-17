import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaTag,
} from "react-icons/fa";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://eventbook.runasp.net/api/Events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEvent(data.data);
        } else {
          toast.error("Failed to load event details");
        }
      } catch {
        toast.error("Error fetching event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookEvent = async () => {
    const confirm = window.confirm("Are you sure you want to book this event?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    setBookingLoading(true);

    try {
      const res = await fetch("https://eventbook.runasp.net/api/Bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id, status: "Booked" }),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      if (res.ok) {
        toast.success("Event booked successfully!");
        setEvent({ ...event, bookings: [{}] }); // Simulate booking state
      } else {
        toast.error("Failed to book the event.");
      }
    } catch {
      toast.error("Error booking event");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium text-red-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-16">
      <Toaster />
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <img
          src={event.imageUrl?.replace("https://localhost:7014", "https://eventbook.runasp.net")}
          alt={event.name}
          className="w-full h-80 object-cover"
        />
        <div className="p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{event.name}</h1>
          <p className="text-lg text-gray-700">{event.description}</p>

          <div className="grid md:grid-cols-2 gap-4 text-gray-600 text-md">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              <span>{new Date(event.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-green-500" />
              <span>${event.price}</span>
            </div>
            {event.categoryName && (
              <div className="flex items-center gap-2">
                <FaTag className="text-purple-500" />
                <span>{event.categoryName}</span>
              </div>
            )}
          </div>

          {event.isBooked ? (
            <p className="text-green-600 font-semibold mt-4">
              ✅ You have already booked this event
            </p>
          ) : (
            <button
              onClick={handleBookEvent}
              disabled={bookingLoading}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-60"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
