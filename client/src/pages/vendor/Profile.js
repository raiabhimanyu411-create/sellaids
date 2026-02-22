import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import UserFooter from "../../components/UserFooter";

// ENV SE API URL LE RAHE HAIN
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [vendor, setVendor] = useState({
    name: "", email: "", phone: "", business_name: "", business_type: "",
    gst_number: "", pan_number: "", bank_name: "", account_number: "",
    ifsc_code: "", account_type: "", photo: null,
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false, newPassword: false, confirmPassword: false,
  });

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/vendor/profile`, {
        withCredentials: true,
      });
      const data = response.data.data || response.data;
      setVendor({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        business_name: data.business_name || "",
        business_type: data.business_type || "",
        gst_number: data.gst_number || "",
        pan_number: data.pan_number || "",
        bank_name: data.bank_name || "",
        account_number: data.account_number || "",
        ifsc_code: data.ifsc_code || "",
        account_type: data.account_type || "",
        photo: data.photo || null,
      });
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields({ ...passwordFields, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === "personal") {
      if (!vendor.name.trim()) newErrors.name = "Name is required";
      if (!vendor.phone.trim()) newErrors.phone = "Phone is required";
      else if (!/^\+?\d{10,15}$/.test(vendor.phone))
        newErrors.phone = "Invalid phone number";
    }

    if (activeTab === "business") {
      if (!vendor.business_name) newErrors.business_name = "Business name required";
      if (!vendor.business_type) newErrors.business_type = "Business type required";
      if (!vendor.gst_number) newErrors.gst_number = "GST number required";
      if (!vendor.pan_number) newErrors.pan_number = "PAN number required";
    }

    if (activeTab === "bank") {
      if (!vendor.bank_name) newErrors.bank_name = "Bank name required";
      if (!vendor.account_number) newErrors.account_number = "Account number required";
      if (!vendor.ifsc_code) newErrors.ifsc_code = "IFSC code required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(vendor.ifsc_code.toUpperCase()))
        newErrors.ifsc_code = "Invalid IFSC code";
      if (!vendor.account_type) newErrors.account_type = "Account type required";
    }

    if (activeTab === "security" && showPasswordForm) {
      if (!passwordFields.currentPassword) newErrors.currentPassword = "Current password required";
      if (!passwordFields.newPassword) newErrors.newPassword = "New password required";
      if (passwordFields.newPassword.length < 6) newErrors.newPassword = "Password must be 6+ characters";
      if (passwordFields.newPassword !== passwordFields.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let endpoint = "";
      let payload = {};

      if (activeTab === "personal") {
        endpoint = `${API_URL}/api/vendor/personal`;
        payload = { name: vendor.name, phone: vendor.phone };
      } else if (activeTab === "business") {
        endpoint = `${API_URL}/api/vendor/business`;
        payload = {
          business_name: vendor.business_name,
          business_type: vendor.business_type,
          gst_number: vendor.gst_number,
          pan_number: vendor.pan_number,
        };
      } else if (activeTab === "bank") {
        endpoint = `${API_URL}/api/vendor/bank`;
        payload = {
          bank_name: vendor.bank_name,
          account_number: vendor.account_number,
          ifsc_code: vendor.ifsc_code,
          account_type: vendor.account_type,
        };
      } else if (activeTab === "security") {
        endpoint = `${API_URL}/api/vendor/security`;
        payload = passwordFields;
      }

      await axios.put(endpoint, payload, { withCredentials: true });

      if (activeTab === "security") {
        await axios.post(`${API_URL}/api/vendor/auth/logout`, {}, { withCredentials: true });
        toast.success("Password changed! Logging you out...");
        setTimeout(() => window.location.replace("/vendor/login"), 1500);
      } else {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setShowPasswordForm(false);
        fetchVendorData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "business", label: "Business Info" },
    { id: "bank", label: "Bank Details" },
    { id: "security", label: "Security" },
  ];

  return (
      <div>
    <div className="min-h-screen bg-gray-50 px-2 py-6 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your account information securely</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-white">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30 overflow-hidden">
                {vendor.photo ? (
                  <img src={vendor.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  vendor.name?.charAt(0).toUpperCase() || "V"
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold">{vendor.name || "Vendor Name"}</h2>
                <p className="text-white/90 mt-1">{vendor.email || "email@example.com"}</p>
                <p className="text-white/80 text-sm mt-1">{vendor.business_name || "Your Business"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs - Mobile Scrollable */}
          <div className="sticky top-0 bg-white border-b z-10 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

              {/* Personal Info */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text" name="name" value={vendor.name}
                      onChange={handleInputChange} disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition ${!isEditing && "bg-gray-50"}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email" value={vendor.email} disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="text" name="phone" value={vendor.phone}
                      onChange={handleInputChange} disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition ${!isEditing && "bg-gray-50"}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              )}

              {/* Business Info */}
              {activeTab === "business" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["business_name", "business_type", "gst_number", "pan_number"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {field.replace(/_/g, " ")}
                      </label>
                      <input
                        type="text" name={field} value={vendor[field]}
                        onChange={handleInputChange} disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border ${errors[field] ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition ${!isEditing && "bg-gray-50"}`}
                      />
                      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Bank Details */}
              {activeTab === "bank" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input type="text" name="bank_name" value={vendor.bank_name} onChange={handleInputChange} disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.bank_name ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition ${!isEditing && "bg-gray-50"}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input type="text" name="account_number" value={vendor.account_number} onChange={handleInputChange} disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.account_number ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition ${!isEditing && "bg-gray-50"}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input type="text" name="ifsc_code" value={vendor.ifsc_code} onChange={handleInputChange} disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.ifsc_code ? "border-red-500" : "border-gray-300"} uppercase focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition ${!isEditing && "bg-gray-50"}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    {isEditing ? (
                      <select name="account_type" value={vendor.account_type || "savings"} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100">
                        <option value="savings">Savings</option>
                        <option value="current">Current</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 capitalize">
                        {vendor.account_type || "Not set"}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="max-w-2xl space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                  {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                    <div key={field} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
                      </label>
                      <input
                        type={showPassword[field] ? "text" : "password"}
                        name={field} value={passwordFields[field]} onChange={handlePasswordChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors[field] ? "border-red-500" : "border-gray-300"} focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition ${!isEditing && "bg-gray-50"}`}
                      />
                      <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}
                        className="absolute right-3 top-10 text-gray-500 hover:text-orange-600">
                        {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                {!isEditing ? (
                  <button
                    onClick={() => { setIsEditing(true); if (activeTab === "security") setShowPasswordForm(true); }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition disabled:opacity-70"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setShowPasswordForm(false);
                        setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setErrors({});
                        fetchVendorData();
                      }}
                      className="w-full sm:w-auto px-8 py-4 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    {/* UserFooter added */}
      <UserFooter />
    </div>
  );
};

export default Profile;