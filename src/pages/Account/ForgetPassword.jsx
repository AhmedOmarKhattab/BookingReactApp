import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    const body = {
      email,
      clientUrl: `${window.location.origin}/reset-password`, // adjust as needed
    };

    try {
      const res = await fetch("https://eventbook.runasp.net/api/Account/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("Reset link sent to your email please check your mail");
        setEmail("");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to send reset email.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-white px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-4">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
