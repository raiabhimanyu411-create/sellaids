import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Download, Edit } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import AdminProductEdit from "./AdminProductEdit";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  const [adminEditProduct, setAdminEditProduct] = useState(null);

  const itemsPerPage = 10;

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/management/product`,
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
        setProducts(data.products);
        setTotalProducts(data.total);
        toast.success(message);
      } else {
        setProducts([]);
        setTotalProducts(0);
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, currentPage]);

  // Search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  // Status update
  const updateStatus = async (productId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/management/product/${productId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Product status updated successfully");
      fetchProducts();
      closeEditModal();
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  // Edit modal
  const openEditModal = (product) => setEditProduct(product);
  const closeEditModal = () => setEditProduct(null);
  const handleStatusChange = (e) => {
    setEditProduct((prev) => ({ ...prev, status: e.target.value }));
  };
  const handleSaveEdit = () => {
    updateStatus(editProduct.id, editProduct.status);
  };

  // Excel Export
  const exportExcel = () => {
    if (!products.length) return;
    const ws = XLSX.utils.json_to_sheet(
      products.map((p, index) => ({
        SR_No: (currentPage - 1) * itemsPerPage + index + 1,
        SKU: p.sku,
        Product_Name: p.product_type,
        Brand: p.brand,
        Price: p.selling_price,
        Status: p.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
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
          placeholder="Search by SKU or Product Name"
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">SR.</th>
              <th className="px-4 py-3 border">SKU</th>
              <th className="px-4 py-3 border">Product Name</th>
              <th className="px-4 py-3 border">Brand</th>
              <th className="px-4 py-3 border">Price</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No matching products
                </td>
              </tr>
            ) : (
              products?.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 border font-medium">{p.sku}</td>
                  <td className="px-4 py-3 border">{p.product_type}</td>
                  <td className="px-4 py-3 border">{p.brand}</td>
                  <td className="px-4 py-3 border">{p.selling_price}</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border flex gap-2">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-green-500 hover:text-green-700 flex items-center gap-1"
                    >
                      <Edit size={16} /> Approvement
                    </button>
                    <button
                      onClick={() => setAdminEditProduct(p)}
                      className="text-green-500 hover:text-green-700 flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
                  className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-blue-600 text-white" : ""
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
                  className={`px-3 py-1 border rounded ${currentPage === i ? "bg-blue-600 text-white" : ""
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
      {editProduct && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeEditModal}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Update Product Status</h3>
            <div className="flex flex-col gap-3">
              <select
                name="status"
                value={editProduct.status}
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

      {adminEditProduct && (
        <AdminProductEdit
          product={adminEditProduct}
          onClose={() => setAdminEditProduct(null)}
          onUpdateSuccess={fetchProducts}
        />
      )}

    </div>
  );
};

export default ProductManagement;
