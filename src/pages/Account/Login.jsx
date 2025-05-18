import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      const response = await fetch("https://eventbook.runasp.net/api/Account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Login failed");
      }

      const accessToken = result.data.tokens.accessToken;
      const refreshToken = result.data.tokens.refreshToken;
      const user = result.data.user;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome ${user.displayName}`);
      navigate("/");
      window.location.reload();
        } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Forgot Password Link */}
          <div className="mt-2 text-right">
            <Link
              to="/forget-password"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
