import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Same validation as before
  const validators = {
    name: (val) => !formData.name.trim() ? "Name is required" : formData.name.trim().length < 2 ? "Name too short" : null,
    email: (val) => !val ? "Email required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Invalid email" : null,
    mobile: (val) => !val ? "Mobile required" : !/^(\+?\d{10,15})$/.test(val.replace(/\s/g, "")) ? "Invalid mobile number" : null,
    password: (val) => {
      if (!val) return "Password required";
      if (val.length < 8) return "Min 8 characters";
      if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(val)) return "Include uppercase, lowercase, number & special char";
      return null;
    },
    pincode: (val) => val && !/^\d{5,10}$/.test(val) ? "Invalid pincode" : null,
  };

  const validateField = (name, value) => {
    const error = validators[name]?.(value) || null;
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "mobile") {
      const cleaned = value.replace(/[^\d+]/g, "");
      if (cleaned.startsWith("+")) {
        formatted = "+" + cleaned.slice(1).replace(/[^\d]/g, "").slice(0, 15);
      } else {
        formatted = cleaned.replace(/[^\d]/g, "").slice(0, 15);
      }
    } else if (name === "pincode") {
      formatted = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [name]: formatted }));
    validateField(name, formatted);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGlobalError("");

    const hasError = Object.keys(validators).some(key => {
      const err = validators[key](formData[key]);
      if (err) setErrors(prev => ({ ...prev, [key]: err }));
      return err;
    });
    if (hasError) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/auth/register`,
        {
          name: formData.name.trim(),
          phone: formData.mobile.trim(),
          email: formData.email.trim(),
          password: formData.password,
          address_line: formData.address_line.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim() || undefined,
        },
        { withCredentials: true }
      );

      alert("Registration Successful!");
      navigate("/UserAuth/UserLogin");
    } catch (err) {
      setGlobalError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-12">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-heading  text-center text-gray-900 mb-8">
            REGISTER
          </h2>

          {/* Global Error */}
          {globalError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center font-medium">
              {globalError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} />
              <Input label="Mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} error={errors.mobile} placeholder="+919876543210" />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
              
              <div className="relative">
                <Input label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} error={errors.password} />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-gray-500 hover:text-orange-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1">
                 Include uppercase, lowercase, number & special character

              </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Input label="Address" name="address_line" value={formData.address_line} onChange={handleInputChange} error={errors.address_line} />
              <Input label="City" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} />
              <Input label="State" name="state" value={formData.state} onChange={handleInputChange} error={errors.state} />
              <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} error={errors.pincode} />
            </div>

            {/* Buttons */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 mt-10">
              <button
                type="button"
                onClick={() => navigate("/UserAuth/UserLogin")}
                className="w-full sm:w-auto px-10 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition"
                disabled={loading}
              >
                BACK TO LOGIN
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-10 py-3 font-bold text-white rounded-lg transition shadow-lg ${
                  loading 
                    ? "bg-orange-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                }`}
              >
                {loading ? "Registering..." : "REGISTER"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component (Same look as your original)
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1.5 text-sm">
      {label}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
        error ? "border-red-400" : "border-gray-300"
      } ${props.type === "password" ? "pr-12" : ""}`}
    />
    {error && <p className="text-red-600 text-xs mt-1.5 font-medium">{error}</p>}
  </div>
);

export default Register;