import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBox, FaClock, FaRupeeSign, FaChartLine } from "react-icons/fa";
import { useVendorStore } from "../../stores/useVendorStore";
import axios from "axios";
import UserFooter from "../../components/UserFooter";

const DashboardHome = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalEarnings: "₹0",
    thisMonthSales: "₹0",
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { vendor, logout } = useVendorStore();

  const vendorName = vendor?.name || "Vendor";
  const vendorInitials = vendorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /* -------------------------------------------------------------
     FETCH DASHBOARD DATA + RECENT PRODUCTS
     ------------------------------------------------------------- */
         const fetchDashboardData = async () => {
      if (!vendor?.id) return;

      try {
        setLoading(true);

        /* 1. Summary – pass vendor_id as query param (backend needs it) */
        const summaryUrl = `http://localhost:5000api/product/dashboard?vendor_id=${vendor.id}`;
        const summaryRes = await axios.get(summaryUrl, { withCredentials: true });

        // ----> Log the API response data for debugging
        // console.log("Dashboard Data:", summaryRes.data);
        
        // Assuming the response data is properly structured
        const data = summaryRes.data?.data;
        // console.log(data,':::::::::::::::')
        setSummary({
          totalProducts: data.total_products ?? 0,
          pendingOrders: data.pending_orders ?? 0,
          totalEarnings: `₹${Number(data.total_earnings ?? 0).toLocaleString()}`,
          thisMonthSales: `₹${Number(data.this_month_sales ?? 0).toLocaleString()}`,
        });

        /* 2. Recent 5 products (already filtered by vendor_id) */
        const productsUrl = `http://localhost:5000api/product/products-list?vendor_id=${vendor.id}&page=1&limit=5`;
        const productsRes = await axios.get(productsUrl, { withCredentials: true });

        // ----> Log the products response for debugging
        // console.log("Recent Products:", productsRes.data);

        setRecentProducts(productsRes.data.products ?? []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401) {
          logout();
          navigate("/vendor/login");
        }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {


    fetchDashboardData();
  }, [vendor?.id, logout, navigate]);

  /* -------------------------------------------------------------
     UI
     ------------------------------------------------------------- */

    //  console.log("Rendering DashboardHome with:", { summary, recentProducts, loading });
  return (
      <div>
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Vendor Dashboard</h1>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 text-sm sm:text-base">
            Welcome back, <span className="font-semibold">{vendorName}</span>
          </span>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            {vendorInitials}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[ 
          { label: "Total Products",   value: summary.totalProducts,   icon: <FaBox className="text-blue-500 text-xl" />,   bg: "bg-blue-100" },
          { label: "Pending Orders",  value: summary.pendingOrders,  icon: <FaClock className="text-yellow-500 text-xl" />, bg: "bg-yellow-100" },
          { label: "Total Earnings",  value: summary.totalEarnings,  icon: <FaRupeeSign className="text-green-500 text-xl" />, bg: "bg-green-100" },
          { label: "This Month Sales",value: summary.thisMonthSales, icon: <FaChartLine className="text-purple-500 text-xl" />, bg: "bg-purple-100" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-4 sm:p-5 rounded-xl shadow flex items-center justify-between"
          >
            <div>
              <h2 className="text-sm text-gray-500">{card.label}</h2>
              <p className="text-xl sm:text-2xl font-bold">
                {loading ? "Loading..." : card.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bg}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Products Table */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent Products</h2>
          <button
            onClick={() => navigate("/vendor/all-products")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2">SR.</th>
              <th className="p-2">SKU</th>
              <th className="p-2">Category</th>
              <th className="p-2">Group</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Model</th>
              <th className="p-2">Price</th>
              <th className="p-2">Status</th>
              <th className="p-2">Vendor</th>
              <th className="p-2">Front Photo</th>
              <th className="p-2">View</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.length > 0 ? (
              recentProducts.map((product, idx) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold">{idx + 1}</td>
                  <td className="p-2 text-orange-600 cursor-pointer">{product.sku}</td>
                  <td className="p-2">{product.category?.name ?? "N/A"}</td>
                  <td className="p-2">{product.product_group}</td>
                  <td className="p-2">{product.brand}</td>
                  <td className="p-2 font-semibold">{product.model_name}</td>
                  <td className="p-2 font-bold">
                    ₹{Number(product.selling_price).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${product.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-2">{product.vendor?.name ?? "N/A"}</td>
                  <td className="p-2">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${product.front_photo}`}
                      alt="not_found"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">
                    <Link
                      to={`/vendor/view-product/${product.id}`}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    {/* UserFooter added */}
      <UserFooter />
    </div>
  );
};

export default DashboardHome;