// src/pages/dashboard/DashboardHome.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useUserStore } from "../../stores/useUserStore";
import api from "../../api/axiosInstance"; // ← Use api
import {
  FiPackage, FiClock, FiHeart, FiMessageSquare,
  FiShoppingCart, FiEye, FiHeadphones,
} from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import UserFooter from "../../components/UserFooter";

const DashboardHome = () => {
  const { user } = useUserStore();

  const [kpi, setKpi] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wishlistCount: 0,
    supportTickets: 0,
  });
  const [chart, setChart] = useState({ trends: [], status: [] });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/api/user/dashboard"); // ← Use api

      const d = data.data;

      setKpi({
        totalOrders: d.total_orders,
        pendingOrders: d.pending_orders,
        wishlistCount: d.wishlist_items,
        supportTickets: d.support_tickets,
      });

      setChart({
        trends: d.order_trends.map((t) => ({
          month: new Date(t.month + "-01").toLocaleString("default", { month: "short" }),
          orders: +t.count,
        })),
        status: d.order_status_breakdown.map((s) => ({
          name: s.order_status.charAt(0).toUpperCase() + s.order_status.slice(1),
          value: +s.count,
        })),
      });

      setActivity(d.recent_activity);
    } catch (err) {
      setError(err.response?.data?.message || "Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
const cards = [
  { 
    title: "Total Orders", 
    value: kpi.totalOrders, 
    icon: FiPackage, 
    color: "text-blue-600",
    link: "/user/orders"
  },
  { 
    title: "Pending Orders", 
    value: kpi.pendingOrders, 
    icon: FiClock, 
    color: "text-yellow-600",
    link: "/user/orders?filter=pending"
  },
  { 
    title: "Wishlist Items", 
    value: kpi.wishlistCount, 
    icon: FiHeart, 
    color: "text-pink-600",
    link: "/user/wishlist"
  },
  { 
    title: "Support Tickets", 
    value: kpi.supportTickets, 
    icon: FiMessageSquare, 
    color: "text-green-600",
    link: "/user/support"
  },
];
  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">
          Welcome back, <span className="font-medium text-pink-600">{user?.name || "User"}</span>!
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{c.title}</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: c.color.replace("600", "700") }}>
                    {c.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-opacity-10 ${c.color.replace("text-", "bg-")} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${c.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Trend (Last 6 Months)</h3>
          {chart.trends.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chart.trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={3} dot={{ fill: "#ec4899", r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-10">No order data yet</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
          {chart.status.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chart.status}
                  cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90} fill="#8884d8" dataKey="value"
                >
                  {chart.status.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-10">No status data yet</p>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => window.location.href = "/shop"} className="flex items-center gap-2 bg-pink-600 text-white px-5 py-3 rounded-lg hover:bg-pink-700 transition font-medium">
            <FiShoppingCart /> Continue Shopping
          </button>
          <button onClick={() => window.location.href = "/user/orders"} className="flex items-center gap-2 border border-pink-600 text-pink-600 px-5 py-3 rounded-lg hover:bg-pink-50 transition font-medium">
            <FiEye /> View All Orders
          </button>
          <button onClick={() => window.location.href = "/user/support"} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
            <FiHeadphones /> Contact Support
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        {activity.length ? (
          <ul className="space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex justify-between items-center text-sm pb-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{a.description}</span>
                <span className="text-gray-500">{a.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        )}
      </div>

{/* ✅ UserFooter added */}
      <div className="mt-8">
        <UserFooter />
      </div>
    </div>
  );
};

export default DashboardHome;