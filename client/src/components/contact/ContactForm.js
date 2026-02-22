import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Restrict phone input to digits only, max 10
        if (name === "phone") {
            const onlyDigits = value.replace(/\D/g, ""); // Remove non-digits
            if (onlyDigits.length <= 10) {
                setFormData({ ...formData, [name]: onlyDigits });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        let tempErrors = {};

        if (!formData.name.trim()) {
            tempErrors.name = "Name is required.";
        }

        if (!formData.email.trim()) {
            tempErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Invalid email format.";
        }

        if (!formData.phone.trim()) {
            tempErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            tempErrors.phone = "Phone must be 10 digits.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/contact`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (res.data.success) {
                alert("Your query has been submitted ✅");

                // Reset form after success
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });
                setErrors({});
            } else {
                alert("Something went wrong. Please try again later.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(
                error.response?.data?.message ||
                "Server error. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-8 p-6 md:p-8 bg-gray-50">
            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 bg-white shadow-md rounded-xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Get in Touch
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 flex-1 flex flex-col"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-medium">
                            Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium">
                            Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 font-medium">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium">
                            Add your query here
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[120px] md:min-h-[150px]"
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg transition text-white ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600"
                        }`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>

            {/* Right Side: Map */}
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-md">
                <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.477941232288!2d77.05882487455101!3d28.42318747577211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193c3e7d2a7f%3A0xf6f66d85e57a7e9!2sSector%2050%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1724155550000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "250px", height: "100%" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[250px] sm:h-[300px] md:h-[450px] w-full"
                ></iframe>
            </div>
        </div>
    );
};

export default ContactForm;