import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import UserFooter from "../../components/UserFooter";
// ENV BASE URL + FLICKER-FREE IMAGE HELPER
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "/placeholder-image.jpg";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function Products() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchSKU, setSearchSKU] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const location = useLocation();

  const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
  const vendorId = vendorInfo?.id;

  // Fetch categories
  // Fetch categories - GROUP WISE
  const fetchCategories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedGroup) {
        params.append("group", selectedGroup);
      }

      const res = await axios.get(
        `${API_URL}/api/product/categories-list?${params.toString()}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setCategories([
          { id: "", name: "All Categories" },
          ...(res.data.data || [])
        ]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([{ id: "", name: "All Categories" }]);
    }
  }, [selectedGroup]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", 10);
      if (category) params.append("category_id", category);
      if (searchName || searchSKU) params.append("search", searchName || searchSKU);
      if (vendorId) params.append("vendor_id", vendorId);

      const res = await axios.get(
        `${API_URL}/api/product/products-list?${params.toString()}`,
        { withCredentials: true }
      );

      console.log("Fetched Products:", res.data.products);

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [category, currentPage, searchName, searchSKU, vendorId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchProducts();
    }
  }, [location.state, fetchProducts]);

  
  const resetFilters = () => {
    setCategory("");
    setSearchName("");
    setSearchSKU("");
    setCurrentPage(1);
  };

  return (
    <div>
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-3">My Products</h1>
      <nav className="text-sm mb-4 text-gray-600">
        Home  <span className="text-orange-600 cursor-pointer">Products</span>
      </nav>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Group Filter */}
        <div>
          <label className="block font-semibold mb-1">Group</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setCategory("");
              setCurrentPage(1);
            }}
          >
            <option value="">All Groups</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Girl">Girl</option>
            <option value="Boy">Boy</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!selectedGroup && selectedGroup !== ""} // optional UX
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model Name */}
        <div>
          <label className="block font-semibold mb-1">Model Name</label>
          <input
            type="text"
            placeholder="Search by model"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block font-semibold mb-1">SKU</label>
          <input
            type="text"
            placeholder="Search by SKU"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={searchSKU}
            onChange={(e) => setSearchSKU(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
          >
            Search
          </button>
          <button
            onClick={() => {
              setSelectedGroup("");
              setCategory("");
              setSearchName("");
              setSearchSKU("");
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <>
            <table className="min-w-[1200px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="py-3 px-4 text-left">SR.</th>
                  <th className="py-3 px-4 text-left">SKU</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Group</th>
                  <th className="py-3 px-4 text-left">Brand</th>
                  <th className="py-3 px-4 text-left">Model</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Vendor</th>
                  <th className="py-3 px-4 text-left">Front Photo</th>
                  <th className="py-3 px-4 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="py-4 px-4 font-semibold">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="py-4 px-4 text-orange-600 font-medium">{product.sku}</td>
                    <td className="py-4 px-4">{product.category?.name || "N/A"}</td>
                    <td className="py-4 px-4">{product.product_group}</td>
                    <td className="py-4 px-4">{product.brand}</td>
                    <td className="py-4 px-4 font-semibold">{product.model_name}</td>
                    <td className="py-4 px-4 font-bold text-green-600">
                      ₹{parseFloat(product.selling_price).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : product.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product.status || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-4">{product.vendor?.name || "N/A"}</td>

                    {/* ✅ FIXED - Direct Cloudinary URL using getImageUrl helper */}
                    <td className="py-4 px-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                        <img
                          src={getImageUrl(product.front_photo)}
                          alt="not_found"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <Link
                        to={`/vendor/view-product/${product.id}`}
                        className="text-orange-600 hover:text-orange-800 font-medium hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 bg-white border-t">
              <span className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-16 text-gray-500 text-lg">
            No products found.
          </p>
        )}
      </div>
    </div>
    {/* UserFooter added */}
      <UserFooter />
    </div>
  );
}