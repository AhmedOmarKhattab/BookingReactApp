import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

// Helper function to decode JWT token safely
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

// Extract role from token
function getUserRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = parseJwt(token);
  return payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const role = getUserRoleFromToken();

    setIsAdmin(role === "Admin");
   
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          BookingApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/booking" className="text-gray-700 hover:text-blue-600 font-medium">Booking</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
          <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">Register</Link>

          {isAdmin && (
            <>
              <Link to="/admin/categories" className="text-gray-700 hover:text-blue-600 font-medium">Admin Categories</Link>
              <Link to="/admin/events" className="text-gray-700 hover:text-blue-600 font-medium">Admin Events</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/booking" className="block text-gray-700 hover:text-blue-600">Booking</Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-600">About</Link>
          <Link to="/login" className="block text-gray-700 hover:text-blue-600">Login</Link>
          <Link to="/register" className="block text-gray-700 hover:text-blue-600">Register</Link>

          {isAdmin && (
            <>
              <Link to="/admin/categories" className="block text-gray-700 hover:text-blue-600">Admin Categories</Link>
              <Link to="/admin/events" className="block text-gray-700 hover:text-blue-600">Admin Events</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
