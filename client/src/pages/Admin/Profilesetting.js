import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { logoutAdminAPI } from "../../components/admindashboard/Logout"
import { useAdminStore } from "../../stores/useAdminStore";

const ProfileSettings = () => {
  const [admin, setAdmin] = useState({
    name: "",
    phone: "",
    newPassword: "",
  });
  const [originalAdmin, setOriginalAdmin] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { logout } = useAdminStore()

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/profile`,
          { withCredentials: true }
        );

        if (data.success && data.data) {
          setAdmin({
            name: data.data.name || "",
            phone: data.data.phone || "",
            newPassword: "",
          });
          setOriginalAdmin({
            name: data.data.name || "",
            phone: data.data.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
        setMessage("Failed to load profile data.");
      }
    };

    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {};

    // Only include changed fields
    if (admin.name && admin.name !== originalAdmin.name) updates.name = admin.name;
    if (admin.phone && admin.phone !== originalAdmin.phone) updates.phone = admin.phone;
    if (admin.newPassword) updates.password = admin.newPassword;

    if (Object.keys(updates).length === 0) {
      setMessage("No changes detected.");
      return;
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/profile`,
        updates,
        { withCredentials: true }
      );

      if (data.success) {
        setMessage("Profile updated successfully!");
        setOriginalAdmin({ name: admin.name, phone: admin.phone });
        setAdmin({ ...admin, newPassword: "" });
        logoutAdminAPI()
        logout()
        localStorage.removeItem("admin-store")
        window.location.replace("/admin-login");
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Profile Settings</h2>

      {message && (
        <div className="mb-4 text-center text-sm text-green-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={admin.name}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={admin.phone}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={admin.newPassword}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Leave blank if not changing"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
