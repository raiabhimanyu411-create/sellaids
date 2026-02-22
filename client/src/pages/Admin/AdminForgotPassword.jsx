import React, { useState } from "react";
import axios from "axios";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/auth/forgot-password`,
        { email }
      );

      if (res.data.success) {
        setEmail("");
        setSuccessMsg(res.data.message);
        alert("Password reset link has been sent to your email ✅");
      } else {
        alert(res.data.message || "Request failed ❌");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Forgot Password
        </h2>

        {successMsg ? (
          <div className="text-green-600 text-center">{successMsg}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminForgotPassword;
