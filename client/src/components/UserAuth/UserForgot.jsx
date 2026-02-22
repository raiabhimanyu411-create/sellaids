import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";  // ← Sahi import (tumne "toast}" likha tha pehle, ab theek hai)

const UserForgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    } else {
      setError("");
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/auth/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message || "Reset link sent to your email!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
          User Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {error && <p className="text-red-500 mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForgot;