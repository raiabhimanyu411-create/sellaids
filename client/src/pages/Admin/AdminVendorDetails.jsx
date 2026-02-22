import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AdminVendorDetails = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch vendor details
  const fetchVendorDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000api/admin/management/vendor/${vendorId}`
      );
      if (res.data.success) {
        setVendor(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
  }, [vendorId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading vendor details...
      </div>
    );

  if (!vendor)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Vendor not found!
      </div>
    );
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Vendor Details</h2>
        <Link
          to="/admin/vendors"
          className="text-blue-600 hover:underline"
        >
          ← Back to List
        </Link>
      </div>

      {/* 🧾 Vendor Info */}
      <div className="bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Personal Information
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Name:</strong> {vendor.name}
            </p>
            <p>
              <strong>Email:</strong> {vendor.email}
            </p>
            <p>
              <strong>Phone:</strong> {vendor.phone}
            </p>
            <p>
              <strong>Designation:</strong> {vendor.designation}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  vendor.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : vendor.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {vendor.status}
              </span>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(vendor.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Business Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Business Information
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Business Name:</strong> {vendor.business_name}
            </p>
            <p>
              <strong>Business Type:</strong> {vendor.business_type}
            </p>
            <p>
              <strong>GST Number:</strong> {vendor.gst_number}
            </p>
            <p>
              <strong>PAN Number:</strong> {vendor.pan_number}
            </p>
          </div>
        </div>

        {/* Address Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Address Details
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>House No:</strong> {vendor.house_no}
            </p>
            <p>
              <strong>Street:</strong> {vendor.street_name}
            </p>
            <p>
              <strong>City:</strong> {vendor.city}
            </p>
            <p>
              <strong>State:</strong> {vendor.state}
            </p>
            <p>
              <strong>Pincode:</strong> {vendor.pincode}
            </p>
          </div>
        </div>

        {/* Bank Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Bank Details
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Bank Name:</strong> {vendor.bank_name}
            </p>
            <p>
              <strong>Account Number:</strong> {vendor.account_number}
            </p>
            <p>
              <strong>IFSC Code:</strong> {vendor.ifsc_code}
            </p>
            <p>
              <strong>Account Type:</strong> {vendor.account_type}
            </p>
          </div>
        </div>

        {/* Contact Person */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Alternate Contact Person
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Alternate Person Name:</strong> {vendor?.contact_person_name}
            </p>
            <p>
              <strong>Alternate Person Phone:</strong>{" "}
              {vendor?.contact_person_phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVendorDetails;