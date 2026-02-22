import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWishlistStore from "../../stores/useWishlistStore";
import { toast, Toaster } from "react-hot-toast";

export default function RaiseTicket() {
  const [form, setForm] = useState({ title: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useWishlistStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/support`,
        {
          title: form.title,
          message: form.message,
        },
        { withCredentials: true }
      );

      console.log("Server response:", JSON.stringify(res.data, null, 2)); // Log response for debugging
      const { success, message, data, error } = res.data;
      const ticket = data?.ticket; // Access nested ticket

      if (success && ticket) {
        setForm({ title: "", message: "" });
        toast.success(`Ticket raised successfully ✅`);
        setTimeout(() => {
          navigate("/user/support");
        }, 1500);
      } else {
        const errorMessage = error?.join(", ") || message || "Failed to raise ticket ❌";
        setError(errorMessage);
        toast.error(errorMessage, {
          style: {
            background: "#fee2e2",
            color: "#dc2626",
          },
        });
      }
    } catch (err) {
      console.error("Axios error:", JSON.stringify(err.response?.data, null, 2)); // Log error details
      const errorMessage =
        err.response?.data?.error?.join(", ") ||
        err.response?.data?.message ||
        "Failed to raise ticket. Please try again ❌";
      setError(errorMessage);
      toast.error(errorMessage, {
        style: {
          background: "#fee2e2",
          color: "#dc2626",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/user/support");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">Raise a Support Ticket</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter ticket title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
            maxLength={200}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            placeholder="Describe your issue"
            value={form.message}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-600"
            required
            disabled={loading}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 disabled:bg-red-400"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}