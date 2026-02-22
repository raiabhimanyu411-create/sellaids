import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Download, Trash2 } from "lucide-react";
import RatingStars from "../../components/admindashboard/RatingStars";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const itemsPerPage = 10;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/review`,
        {
          params: {
            search: search.trim(),
            page: currentPage,
            limit: itemsPerPage,
          },
          withCredentials: true,
        }
      );

      const { success, data, message } = res.data;
      if (!success) throw new Error(message || "Failed to fetch reviews");

      setReviews(data?.reviews || []);
      setTotalReviews(data?.total_reviews || 0);
      if (search.trim()) toast.success(message);
    } catch (err) {
      console.error(err);
      setReviews([]);
      setTotalReviews(0);
      toast.error(err.message || "Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  // === Search Handler ===
  const handleSearch = () => {
    setCurrentPage(1);
    fetchReviews();
  };

  // === Delete Review ===
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/review/${reviewId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Review deleted successfully!");
        // Optimistic update or refetch
        fetchReviews();
      } else {
        toast.error(res.data.message || "Failed to delete review");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error deleting review");
    }
  };

  // === Export Excel ===
  const exportExcel = () => {
    if (!reviews.length) {
      toast.error("No reviews to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      reviews.map((r, index) => ({
        SR_No: (currentPage - 1) * itemsPerPage + index + 1,
        User: r?.user?.name || "N/A",
        Product: r?.product?.product_type || "N/A",
        Model: r?.product?.model_name || "N/A",
        Rating: r?.rating || "N/A",
        Comment: r?.review_text || "N/A",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reviews");
    XLSX.writeFile(wb, "reviews.xlsx");
    toast.success("Excel exported successfully!");
  };

  const totalPages = Math.ceil(totalReviews / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reviews Management</h2>
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2 flex-wrap bg-white shadow-sm p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by name, product Name, model Name"
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

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">SR.</th>
              <th className="px-4 py-3 border">User Name</th>
              <th className="px-4 py-3 border">Product Name</th>
              <th className="px-4 py-3 border">Model Name</th>
              <th className="px-4 py-3 border">Rating</th>
              <th className="px-4 py-3 border">Comment</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading reviews...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((r, index) => (
                <tr key={r.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 border font-medium">
                    {r?.user?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">
                    {r?.product?.product_type || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">
                    {r?.product?.model_name || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">
                    <RatingStars rating={r?.rating || 0} />
                  </td>
                  <td className="px-4 py-3 border">
                    {r?.review_text || "N/A"}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
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

          {/* Page Numbers Logic */}
          {(() => {
            const pages = [];
            const showPages = 5; // only 5 pages visible

            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + showPages - 1);

            if (end - start < showPages - 1) {
              start = Math.max(1, end - showPages + 1);
            }

            // Show first page if not included
            if (start > 1) {
              pages.push(
                <button
                  key={1}
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 1 ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  1
                </button>
              );
              pages.push(<span key="dots1">...</span>);
            }

            // Middle pages
            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {i}
                </button>
              );
            }

            // Show last page if not included
            if (end < totalPages) {
              pages.push(<span key="dots2">...</span>);
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === totalPages ? "bg-blue-600 text-white" : ""
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
    </div>
  );
};

export default ReviewsManagement;
