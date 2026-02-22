import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const UserReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    // confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(formData.newPassword)) {
      newErrors.newPassword = "Password is not valid (must contain uppercase, number, special character, min 6 chars)";
      isValid = false;
    }

    // if (!formData.confirmPassword) {
    //   newErrors.confirmPassword = "Confirm Password is required";
    //   isValid = false;
    // } else if (formData.newPassword !== formData.confirmPassword) {
    //   newErrors.confirmPassword = "Passwords do not match";
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      toast.error("Please fix errors in the form", { position: "top-right", duration: 3000 });
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000api/user/auth/reset-password",
        { token, newPassword: formData.newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message || "Password reset successful!", {
        position: "top-right",
        duration: 3000,
      });
      setFormData({ newPassword: ""});
      setErrors({});
      setTimeout(() => navigate("/UserAuth/UserLogin"), 2000);
    } catch (error) {
      console.error("Reset Password API Error:", JSON.stringify(error, null, 2));
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password.";
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
          Reset Password
        </h2>
        <form onSubmit={handleReset} className="space-y-6">
          {/* New Password */}
          <div className="relative">
            <label className="block mb-2 font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-orange-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>
{/* 
          Confirm Password */}
          {/* <div className="relative">
            <label className="block mb-2 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-orange-600"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 transition font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} SellAids — All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default UserReset;