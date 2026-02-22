import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Package, TrendingUp } from "lucide-react";

const productImage = "https://cdn-icons-png.flaticon.com/512/3081/3081559.png"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/management/dashboard`, { withCredentials: true });

      const { success, data, message } = res?.data;
      // console.log(data)
      if (success) {
        setStats({
          totalUsers: data.total_users || 0,
          totalVendors: data.total_vendors || 0,
          totalProducts: data.total_products || 0,
          totalOrders: data.total_orders || 0,
        });
        setTopProducts(
          data.top_products?.map((p, i) => {
            const productInfo = JSON.parse(p.info)
            // console.log(productInfo)
            return {
              id: p.id,
              name: p.name,
              img: p.img,
              sales: p.sales,
              price: p.price,
              fabric: productInfo.fabric
            };
          }) || []
        );
        toast.success(message)
      } else {
        toast.error(message)
      }
    } catch (err) {
      console.error("Error fetching admin dashboard:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const topStats = [
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers size={20} />, color: "#FF6A00" },
    { title: "Total Vendors", value: stats.totalVendors, icon: <FaStore size={20} />, color: "#22C55E" },
    { title: "Total Products", value: stats.totalProducts, icon: <FaBoxOpen size={20} />, color: "#8B5CF6" },
    { title: "Total Orders", value: stats.totalOrders, icon: <FaShoppingCart size={20} />, color: "#FACC15" },
  ];

  const maxSales = Math.max(...topProducts.map(p => p.sales), 1);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {topStats?.map((stat, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">{stat?.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{loading ? 0 : stat?.value}</p>
              <p className={`text-xs mt-1 ${stat.trendColor === "green" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend}
              </p>
            </div>
            <div style={{ backgroundColor: stat.color }} className="p-3 rounded-lg text-white">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        {/* Card */}
        <div className="bg-white shadow rounded-lg p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-semibold flex items-center gap-2">
              <TrendingUp className="text-[#FF6A00]" size={20} />
              Top Selling Products
            </h3>
            <span className="text-sm text-gray-500">This Month</span>
          </div>

          {/* Product List */}
          <div className="space-y-4">
            {topProducts?.map((item, i) => (
              <div key={i} className="flex items-center justify-between h-[80px]">
                {/* Product Info */}
                <div className="flex items-start gap-3 w-60">
                  <img src={item.img ? item.img : productImage} className="text-2xl w-[70px] h-[70px] rounded-lg" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 mt-0">{item.name}</p>
                    <p className="text-sm font-medium text-gray-800 mt-[5px]">{item.fabric}</p>
                    <p className="text-xs text-gray-500 mt-[5px]">#{i + 1} best seller</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 relative">
                  <div
                    className="bg-gradient-to-r from-[#FF6A00] to-orange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(item.sales / maxSales) * 100}%` }}
                  ></div>
                </div>

                {/* Sales Count */}
                <div className="flex items-center gap-1 w-20 justify-end">
                  <Package size={15} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {item.sales}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-700 font-semibold">Recent Orders</h3>
            <button className="text-sm text-[#FF6A00] font-medium">View All</button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No Orders</p>
          ) : (
            recentOrders.map((order, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b last:border-none">
                <div>
                  <p className="font-medium text-gray-800">
                    {order.id}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${order.color}`}>
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">{order.name}</p>
                  <p className="text-xs text-gray-400">{order.time}</p>
                </div>
                <div className="font-semibold text-gray-700">Rs. {order.price.toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div> */}
    </div>
  );
};

export default AdminDashboard;