import React, { useState } from "react";
import toast from "react-hot-toast";

const BulkOrderForm = () => {
  const [catalogFile, setCatalogFile] = useState(null);
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setCatalogFile(null);
      setErrors({ catalogFile: "Please upload a file" });
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only Excel files allowed (.xlsx / .xls)");
      e.target.value = "";
      return;
    }

    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    if (file.size > MAX_SIZE) {
      toast.error("Maximum 20MB allowed");
      setErrors({ catalogFile: "Max 20MB allowed" });
      e.target.value = "";
      setCatalogFile(null);
      return;
    }

    setCatalogFile(file);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!catalogFile) newErrors.catalogFile = "Please upload Excel file";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 API Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("file", catalogFile); 

      const response = await fetch(`${API_URL}/api/product/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Bulk upload successful!");
      } else {
        toast.error(result?.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error! Try again later.");
    }

    setCatalogFile(null);
    const input = document.getElementById("catalog-upload");
    if (input) input.value = "";
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/bulkorder.xlsx";
    link.download = "bulkorder.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DOWNLOAD FORMAT BUTTON */}
              <div className="text-center py-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-orange-600 font-bold underline text-lg"
                >
                  Click Here To Download Bulk Order Excel Format
                </button>
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Import Filled Catalog (Max 20MB) *
                </label>

                <div
                  className={`mt-2 p-6 border-2 border-dashed rounded-lg text-center ${
                    errors.catalogFile
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <input
                    type="file"
                    id="catalog-upload"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />

                  <label htmlFor="catalog-upload" className="cursor-pointer">
                    <p className="text-orange-600 font-medium">Choose File</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 20MB • Only .xlsx
                    </p>
                  </label>

                  {catalogFile && (
                    <p className="mt-3 text-green-600 font-medium">
                      {catalogFile.name} (
                      {(catalogFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {errors.catalogFile && (
                  <p className="text-red-600 text-center text-sm mt-2">
                    {errors.catalogFile}
                  </p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700"
              >
                SUBMIT BULK ORDER
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderForm;