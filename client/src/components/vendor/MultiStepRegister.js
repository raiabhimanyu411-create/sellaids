import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MultiStepRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    designation: "",
    business_name: "",
    gst_number: "",
    pan_number: "",
    house_no: "",
    street_name: "",
    city: "",
    state: "",
    pincode: "",
    alternate_person_name: "",
    alternate_person_phone: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    account_type: "",
  });

  const fieldToStep = {
    name: 1, phone: 1, email: 1, password: 1,
    designation: 2, business_name: 2, gst_number: 2, pan_number: 2,
    house_no: 3, street_name: 3, city: 3, state: 3, pincode: 3,
    alternate_person_name: 4, alternate_person_phone: 4,
    account_number: 5, ifsc_code: 5, bank_name: 5, account_type: 5,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (["gst_number", "pan_number", "ifsc_code"].includes(name)) {
      formattedValue = value.toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Full Name is required";
        if (!/^\d{10}$/.test(formData.phone))
          newErrors.phone = "Phone must be exactly 10 digits";
        if (!/^\S+@\S+\.\S+$/.test(formData.email))
          newErrors.email = "Enter a valid email address";
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password))
          newErrors.password = "Password: min 6 chars, 1 uppercase, 1 number, 1 special char";
        break;

      case 2:
        if (!formData.business_name.trim())
          newErrors.business_name = "Business Name is required";
        if (!formData.gst_number) {
          newErrors.gst_number = "GST Number is required";
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
          newErrors.gst_number = "Invalid GST Number format (e.g., 27ABCDE1234F1Z5)";
        }
        if (!formData.pan_number) {
          newErrors.pan_number = "PAN Number is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)) {
          newErrors.pan_number = "Invalid PAN format (e.g., ABCDE1234F)";
        }
        break;

      case 3:
        if (formData.pincode && formData.pincode.length > 0 && formData.pincode.length !== 6) {
          newErrors.pincode = "Enter exactly 6 digits for Pincode";
        } else if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
          newErrors.pincode = "Pincode must contain only digits";
        }
        break;

      case 4:
        if (formData.alternate_person_name?.trim() && !formData.alternate_person_phone?.trim())
          newErrors.alternate_person_phone = "Phone required if name is provided";
        if (formData.alternate_person_phone && !/^\d{10}$/.test(formData.alternate_person_phone))
          newErrors.alternate_person_phone = "Phone must be 10 digits";
        break;

      case 5:
        if (!formData.account_number.trim())
          newErrors.account_number = "Account Number is required";
        else if (!/^\d{9,18}$/.test(formData.account_number))
          newErrors.account_number = "Invalid Account Number - Must be 9 to 18 digits";

        if (!formData.ifsc_code.trim())
          newErrors.ifsc_code = "IFSC Code is required";
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
          newErrors.ifsc_code = "Invalid IFSC Code format (e.g., SBIN0001234)";
        }

        if (!formData.bank_name.trim())
          newErrors.bank_name = "Bank Name is required";

        if (!formData.account_type)
          newErrors.account_type = "Please select Account Type";

        if (!acceptTerms)
          newErrors.acceptTerms = "You must accept Terms & Conditions";
        break;

      default:
        break;
    }

    if (Object.keys(newErrors).length > 0) isValid = false;
    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    const allValid = [1, 2, 3, 4, 5].every((s) => validateStep(s));
    if (!allValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsLoading(true);
    setHasShownSuccess(false);

    try {
      const res = await axios.post(`${API_URL}/api/vendor/auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success && !hasShownSuccess) {
        toast.success("Registration Successful! Redirecting...");
        setHasShownSuccess(true);
      }

      setTimeout(() => navigate("/vendor/login"), 2000);
    } catch (err) {
      if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
        const backendErrors = {};

        err.response.data.error.forEach((errorItem) => {
          if (errorItem.path) {
            const field = errorItem.path;
            let userMessage = "This field is invalid";

            if (field === "phone") userMessage = "This phone number is already registered";
            else if (field === "email") userMessage = "This email is already registered";
            else if (field === "pan_number") userMessage = "This PAN Number is already registered";
            else if (field === "gst_number") userMessage = "This GST Number is already registered";
            else if (field === "account_number") userMessage = "This Account Number is already registered";
            else userMessage = errorItem.message || "Please enter a valid value";

            backendErrors[field] = userMessage;
          }
        });

        setErrors((prev) => ({ ...prev, ...backendErrors }));

        if (Object.keys(backendErrors).length > 0) {
          let errorStep = 5;
          Object.keys(backendErrors).forEach((field) => {
            const s = fieldToStep[field] || 5;
            if (s < errorStep) errorStep = s;
          });
          setStep(errorStep);
        }
      } else {
        toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 text-center">
          <h1 className="text-3xl font-bold">Vendor Registration</h1>
          <p className="mt-2 text-lg">Step {step} of 5</p>
        </div>

        <div className="p-8">
          <div className="flex justify-center gap-3 mb-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-3 w-16 rounded-full transition-all duration-300 ${i <= step ? "bg-orange-600" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Personal Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full p-3 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-orange-500`} placeholder="Enter Full Name" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} maxLength="10"
                      className={`w-full p-3 border rounded-lg ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Phone Number" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full p-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Email Address" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Password *</label>
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                      className={`w-full p-3 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Password" />
                    <button type="button" className="absolute right-3 top-10 text-orange-600 text-sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    {!errors.password && formData.password && (
                      <p className="text-xs text-gray-500 mt-1">
                        Include uppercase, lowercase, number & special character
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Business Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Designation</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleChange}
                      className="w-full p-3 border rounded-lg border-gray-300" placeholder="Enter Designation" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Name *</label>
                    <input type="text" name="business_name" value={formData.business_name} onChange={handleChange}
                      className={`w-full p-3 border rounded-lg ${errors.business_name ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Business Name" />
                    {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GST Number * (15 characters)</label>
                    <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} maxLength="15"
                      className={`w-full p-3 border rounded-lg ${errors.gst_number ? "border-red-500" : "border-gray-300"}`} placeholder="27ABCDE1234F1Z5" />
                    {errors.gst_number && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gst_number}</p>}
                    <p className="text-xs text-gray-500 mt-1">Example: 27ABCDE1234F1Z5</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PAN Number * (10 characters)</label>
                    <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} maxLength="10"
                      className={`w-full p-3 border rounded-lg ${errors.pan_number ? "border-red-500" : "border-gray-300"}`} placeholder="ABCDE1234F" />
                    {errors.pan_number && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pan_number}</p>}
                    <p className="text-xs text-gray-500 mt-1">Example: ABCDE1234F</p>
                  </div>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Step 3: Business Address</h2>
                <div className="space-y-5">
                  <div><label className="block text-sm font-medium mb-1">House No.</label><input type="text" name="house_no" value={formData.house_no} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" placeholder="Enter House No." /></div>
                  <div><label className="block text-sm font-medium mb-1">Street Name</label><input type="text" name="street_name" value={formData.street_name} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" placeholder="Enter Street Name" /></div>
                  <div><label className="block text-sm font-medium mb-1">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" placeholder="Enter City" /></div>
                  <div><label className="block text-sm font-medium mb-1">State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" placeholder="Enter State" /></div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength="6"
                      className={`w-full p-3 border rounded-lg ${errors.pincode ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Pincode" />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Alternate Contact (Optional)</h2>
                <div className="space-y-5">
                  <div><label className="block text-sm font-medium mb-1">Alternate Person Name</label><input type="text" name="alternate_person_name" value={formData.alternate_person_name} onChange={handleChange} className="w-full p-3 border rounded-lg border-gray-300" placeholder="Enter Name" /></div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alternate Phone Number</label>
                    <input type="text" name="alternate_person_phone" value={formData.alternate_person_phone} onChange={handleChange} maxLength="10"
                      className={`w-full p-3 border rounded-lg ${errors.alternate_person_phone ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Phone Number" />
                    {errors.alternate_person_phone && <p className="text-red-500 text-xs mt-1">{errors.alternate_person_phone}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Bank Details & Terms</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Number *</label>
                    <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} maxLength="18"
                      className={`w-full p-3 border rounded-lg ${errors.account_number ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Account Number" />
                    {errors.account_number && <p className="text-red-500 text-xs mt-1">{errors.account_number}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">IFSC Code *</label>
                    <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} maxLength="11"
                      className={`w-full p-3 border rounded-lg ${errors.ifsc_code ? "border-red-500" : "border-gray-300"}`} placeholder="SBIN0001234" />
                    {errors.ifsc_code && <p className="text-red-500 text-xs mt-1 font-medium">{errors.ifsc_code}</p>}
                    <p className="text-xs text-gray-500 mt-1">Example: SBIN0001234</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name *</label>
                    <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange}
                      className={`w-full p-3 border rounded-lg ${errors.bank_name ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Bank Name" />
                    {errors.bank_name && <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Type *</label>
                    <select name="account_type" value={formData.account_type} onChange={handleChange}
                      className={`w-full p-3 border rounded-lg ${errors.account_type ? "border-red-500" : "border-gray-300"}`}>
                      <option value="">Select Account Type</option>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                    </select>
                    {errors.account_type && <p className="text-red-500 text-xs mt-1">{errors.account_type}</p>}
                  </div>

                  <div className="flex items-start gap-3 mt-8">
                    <input type="checkbox" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} className="mt-1 h-5 w-5 text-orange-600" />
                    <label className="text-sm text-gray-700">
                      I accept the <a href="http://localhost:5000terms-conditions" className="text-orange-600 underline">Terms & Conditions</a> and{" "}
                      <a href="http://localhost:5000privacy-policy" className="text-orange-600 underline">Privacy Policy</a>
                    </label>
                  </div>
                  {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              {step > 1 && (
                <button type="button" onClick={prevStep}
                  className="w-full sm:w-auto px-10 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium order-2 sm:order-1">
                  Back
                </button>
              )}
              <div className="flex-1 sm:flex-none order-1 sm:order-2">
                {step < 5 ? (
                  <button type="button" onClick={nextStep}
                    className="w-full px-10 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
                    Next
                  </button>
                ) : (
                  <button type="submit" disabled={isLoading || !acceptTerms}
                    className={`w-full px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold
                      ${isLoading || !acceptTerms ? "opacity-60 cursor-not-allowed" : ""}`}>
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* TOASTER HATA DIYA — AB DOUBLE TOAST KABHI NHI AAYEGA */}
      {/* Sirf App.jsx mein ek <Toaster /> hona chahiye */}
    </div>
  );
};

export default MultiStepRegister;