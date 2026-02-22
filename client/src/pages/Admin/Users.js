import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/management/user`,
        {
          params: {
            search:search,
            page:currentPage,
            limit: itemsPerPage,
          },
          withCredentials: true,
        }
      );

      const { success, data, message } = res.data;

      if (success) {
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
        // Only show toast if search is used
        toast.success(message);
      } else {
        setUsers([]);
        setTotalUsers(0);
        toast.error(message || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setUsers([]);
      setTotalUsers(0);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page change
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);     
    fetchUsers();    
  };

  // Export Excel
  const exportExcel = () => {
    if (!users.length) {
      toast.error("No users to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      users.map((u, index) => ({
        SR_No: (currentPage - 1) * itemsPerPage + index + 1,
        Name: u.name,
        Email: u.email,
        Phone: u.phone,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
    toast.success("Excel exported successfully!");
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Download size={16}/> Export Report
        </button>
      </div>

      {/* Search */}
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
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">SR.</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Phone</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-3 border font-medium">{user.name}</td>
                  <td className="px-4 py-3 border">{user.email}</td>
                  <td className="px-4 py-3 border">{user.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default UsersManagement;
