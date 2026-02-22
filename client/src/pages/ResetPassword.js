import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      alert("Please fill both password fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000api/admin/auth/reset-password`,
        { token, newPassword }, // backend expects { token, newPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Password reset successful ✅");
        navigate("/UserAuth/UserLogin"); // Login page or dashboard
      } else {
        alert("Password reset failed ❌");
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
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;