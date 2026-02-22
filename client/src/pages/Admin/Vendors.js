import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Download, Edit } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVendors, setTotalVendors] = useState(0); // total count from backend
  const [editVendor, setEditVendor] = useState(null);

  const itemsPerPage = 10;

  // Fetch Vendors with pagination
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/management/vendor`,
        {
          params: {
            search,
            status: statusFilter,
            page: currentPage,
            limit: itemsPerPage,
          },
          withCredentials: true,
        }
      );
      const { success, data, message } = res.data;
      if (success) {
        setVendors(data.vendors);
        setTotalVendors(data.total); // total number of vendors
        toast.success(message);
      } else {
        setVendors([]);
        setTotalVendors(0);
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      setVendors([]);
      setTotalVendors(0);
      toast.error("Error fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [statusFilter, currentPage]); // Search handled separately

  // Search Button Click
  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1
    fetchVendors();
  };

  // Status Update
  const updateStatus = async (vendorId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/management/vendor/${vendorId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Status updated successfully");
      fetchVendors(); // Refresh after status update
      closeEditModal();
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  // Edit Modal
  const openEditModal = (vendor) => setEditVendor(vendor);
  const closeEditModal = () => setEditVendor(null);
  const handleStatusChange = (e) => {
    setEditVendor((prev) => ({ ...prev, status: e.target.value }));
  };
  const handleSaveEdit = () => {
    updateStatus(editVendor.id, editVendor.status);
  };

  // Excel Export
  const exportExcel = () => {
    if (!vendors.length) return;
    const ws = XLSX.utils.json_to_sheet(
      vendors.map((v, index) => ({
        SR_No: (currentPage - 1) * itemsPerPage + index + 1,
        Name: v.name,
        Email: v.email,
        Phone: v.phone,
        Status: v.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "vendors.xlsx");
  };

  const totalPages = Math.ceil(totalVendors / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vendor Management</h2>
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 flex-wrap bg-white shadow-sm p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1 focus:ring focus:ring-blue-200"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#FF6A00] text-white rounded-lg hover:bg-orange-500"
        >
          Search
        </button>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Vendor Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">SR.</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Phone</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading vendors...
                </td>
              </tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No matching vendors
                </td>
              </tr>
            ) : (
              vendors.map((v, index) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 border font-medium">{v.name}</td>
                  <td className="px-4 py-3 border">{v.email}</td>
                  <td className="px-4 py-3 border">{v.phone}</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${v.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : v.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border flex gap-2">
                    <Link
                      to={`/admin/vendors/${v.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => openEditModal(v)}
                      className="text-green-500 hover:text-green-700 flex items-center gap-1"
                    >
                      <Edit size={16} />Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )} */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">

          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Buttons with ... */}
          {(() => {
            const pages = [];
            const maxVisible = 5; // 5 buttons only

            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
              start = Math.max(1, end - maxVisible + 1);
            }

            // 1st page
            if (start > 1) {
              pages.push(
                <button
                  key={1}
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-blue-600 text-white" : ""
                    }`}
                >
                  1
                </button>
              );
              pages.push(<span key="dots1">...</span>);
            }

            // middle pages
            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 border rounded ${currentPage === i ? "bg-blue-600 text-white" : ""
                    }`}
                >
                  {i}
                </button>
              );
            }

            // last page
            if (end < totalPages) {
              pages.push(<span key="dots2">...</span>);
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-blue-600 text-white" : ""
                    }`}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

      {/* Edit Modal */}
      {editVendor && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeEditModal}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Update Vendor Status</h3>
            <div className="flex flex-col gap-3">
              <select
                name="status"
                value={editVendor.status}
                onChange={handleStatusChange}
                className="px-3 py-2 border rounded"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleSaveEdit}
                className="bg-[#FF6A00] text-white px-4 py-2 rounded hover:bg-orange-500"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;