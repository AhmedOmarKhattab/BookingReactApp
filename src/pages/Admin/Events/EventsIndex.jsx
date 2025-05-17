import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Import FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const PAGE_SIZE = 5;

const EventsIndex = () => {
  const [events, setEvents] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        PageIndex: page,
        PageSize: PAGE_SIZE,
      });
      const res = await fetch(`https://eventbook.runasp.net/api/Events?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setEvents(data.data.items);
        setTotalCount(data.data.totalCount || 0);
        setPageIndex(page);
      } else {
        toast.error("Failed to fetch events");
      }
    } catch (error) {
      toast.error("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(pageIndex);
  }, []);

  const handleEdit = (eventId) => {
    toast(`Edit event with ID: ${eventId}`);
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`https://eventbook.runasp.net/api/Events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        toast.success("Event deleted successfully!");
        if (events.length === 1 && pageIndex > 1) {
          fetchEvents(pageIndex - 1);
        } else {
          fetchEvents(pageIndex);
        }
      } else {
        toast.error("Failed to delete event");
      }
    } catch (error) {
      toast.error("Error deleting event");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-center" />
      <div className="flex justify-between align-items-center">
      <h1 className="text-3xl font-bold mb-6">Admin - Events List</h1>
      <div>
          <Link
  to="/event/create"className="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"> Create</Link>
      </div>
      </div>
      {loading && <p className="mb-4 text-gray-600">Loading events...</p>}

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Venue</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {events.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-default"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">{event.id}</td>
                  <td className="py-3 px-6 text-left">{event.name}</td>
                  <td className="py-3 px-6 text-left">
                    {event.categoryName || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">{event.venue}</td>
                  <td className="py-3 px-6 text-left">${event.price}</td>
                  <td className="py-3 px-6 text-center space-x-4">
                      <Link
                      to={`/event/edit/${event.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={(e) => e.stopPropagation()}>
                      <FontAwesomeIcon icon={faEdit} size="lg" />
                     </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete Event"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => fetchEvents(pageIndex - 1)}
          disabled={pageIndex === 1 || loading}
          className={`p-2 rounded ${
            pageIndex === 1 || loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800"
          }`}
          aria-label="Previous Page"
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>

        <span className="text-gray-700 font-medium">
          Page {pageIndex} of {totalPages || 1}
        </span>

        <button
          onClick={() => fetchEvents(pageIndex + 1)}
          disabled={pageIndex === totalPages || loading}
          className={`p-2 rounded ${
            pageIndex === totalPages || loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800"
          }`}
          aria-label="Next Page"
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
    </div>
  );
};

export default EventsIndex;
