import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import UserFooter from "../../components/UserFooter";

const Orders = () => {
  const { user, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 4;

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      navigate("/UserAuth/UserLogin");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, user, navigate, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = `${import.meta.env.VITE_API_URL}/api/user/order/list?page=${currentPage}&limit=${limit}`;
      const res = await axios.get(endpoint, { withCredentials: true });
      const fetchedOrders = res.data.data.orders || [];
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      setTotalPages(res.data.data.totalPages || 1);
      setTotalItems(res.data.data.totalItems || 0);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/UserAuth/UserLogin");
      } else {
        setError(err.response?.data?.message || "Failed to fetch orders");
        console.error("Failed to fetch orders:", err.response?.data || err.message);
        setOrders([]);
        setFilteredOrders([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredOrders(orders);
      return;
    }
    const filtered = orders.filter((order) =>
      order.productName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleClear = () => {
    setSearch("");
    setFilteredOrders(orders);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row justify-center items-center mt-8 mb-8 gap-3 text-sm">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <div className="flex flex-wrap justify-center gap-1">{pages}</div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
        <span className="text-gray-600 text-center sm:text-left">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> | Total: <strong>{totalItems}</strong>
        </span>
      </div>
    );
  };

  const showNoMatches = search && filteredOrders.length === 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto ">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          <p className="mt-4 text-lg">Loading your orders...</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition text-base"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition whitespace-nowrap"
                  >
                    Search
                  </button>
                  {search && (
                    <button
                      onClick={handleClear}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition whitespace-nowrap"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {search && (
                <p className="text-sm text-gray-600">
                  Searched for: <span className="font-medium">"{search}"</span>
                </p>
              )}
            </div>
          </div>

      
          <div className="overflow-x-auto">
         
            <div className="hidden lg:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr. No.</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => {
                      const srNo = (currentPage - 1) * limit + index + 1;
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{srNo}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                            <div className="truncate" title={order.productName}>{order.productName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{order.price || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.quantity || "1"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              order.order_status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.order_status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.order_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.order_date}</td>
                          <td className="px-6 py-4 text-center">
                            {order.front_photo ? (
                              <a href={order.front_photo} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={order.front_photo || "/placeholder-image.jpg"}
                                  alt={order.productName}
                                  className="h-16 w-16 object-cover object-center rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                                />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center text-gray-500 text-lg">
                        {showNoMatches ? `No orders found matching "${search}"` : "Your order list is empty."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible on <lg screens */}
            <div className="lg:hidden">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => {
                  const srNo = (currentPage - 1) * limit + index + 1;
                  return (
                    <div key={order.id} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">#{srNo}</p>
                          <p className="text-lg font-medium text-gray-800 mt-1">{order.productName}</p>
                        </div>
                        {order.front_photo && (
                          <a href={order.front_photo} target="_blank" rel="noopener noreferrer">
                            <img
                              src={order.front_photo || "/placeholder-image.jpg"}
                              alt={order.productName}
                              className="h-20 w-20 object-cover object-center rounded-lg border border-gray-200 shadow-sm"
                            />
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-medium">₹{order.price || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Qty:</span>
                          <p className="font-medium">{order.quantity || "1"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                              order.order_status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.order_status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.order_status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">{order.order_date}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">
                    {showNoMatches ? `No orders found matching "${search}"` : "Your order list is empty."}
                  </p>
                </div>
              )}
            </div>


          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && renderPagination()}
        </div>
      )}
      {/* ✅ UserFooter added */}
      <div className="mt-8">
        <UserFooter />
      </div>
    </div>
  );
};

export default Orders;