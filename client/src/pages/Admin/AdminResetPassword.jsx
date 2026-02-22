import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const AdminResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  console.log(token);

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      alert("Please fill both password fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/auth/reset-password`,
        { token, newPassword } // backend expects { token, newPassword }
      );

      if (res.data.success) {
        alert("Password reset successful ✅");
        navigate("/admin-login"); // Login page or dashboard
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
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 -top-3 flex items-center cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </span>
          </div>

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
};

export default AdminResetPassword;
