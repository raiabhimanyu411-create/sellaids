import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Earnings = () => {
  const [stats, setStats] = useState({
    completedEarning: 0,
    thisMonth: 0,
    pendingEarning: 0,
    failedOrRefunded: 0,
  });
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/earnings`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const data = res.data.data;

          setStats({
            completedEarning: data.completed_earning || 0,
            thisMonth: data.this_month_earning || 0,
            pendingEarning: data.pending_earning || 0,
            failedOrRefunded: data.failed_or_refunded_earning || 0,
          });

          const graphData = (data.monthly_earning_summary || []).map((item) => ({
            month: item.month,
            earnings: parseFloat(item.total) || 0,
          }));

          setMonthlyEarnings(graphData);
        }
      } catch (err) {
        console.error("Error fetching earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your earnings...</p>
        </div>
      </div>
    );
  }

  const cards = [
    { title: "Total Completed", value: stats.completedEarning, gradient: "from-green-500 to-emerald-600" },
    { title: "This Month", value: stats.thisMonth, gradient: "from-blue-500 to-cyan-600" },
    { title: "Pending Payouts", value: stats.pendingEarning, gradient: "from-orange-500 to-amber-600" },
    { title: "Failed / Refunded", value: stats.failedOrRefunded, gradient: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER - MOBILE PE EK LINE MEIN */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900 leading-tight">
            Earnings Overview
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Track your sales & payouts in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  ₹{card.value.toLocaleString("en-IN")}
                </p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
            </div>
          ))}
        </div>

        {/* Monthly Earnings Chart - FULLY RESPONSIVE & FUTURE-PROOF */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Monthly Earnings Trend
            </h2>

            {monthlyEarnings.length > 0 ? (
              <div className="w-full h-64 sm:h-80 lg:h-96 -mx-5 sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyEarnings}
                    margin={{
                      top: 20,
                      right: window.innerWidth < 640 ? 10 : 30,
                      left: window.innerWidth < 640 ? 10 : 20,
                      bottom: monthlyEarnings.length > 12 ? 90 : 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" vertical={false} />
                    
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      angle={monthlyEarnings.length > 12 ? -45 : 0}
                      textAnchor={monthlyEarnings.length > 12 ? "end" : "middle"}
                      height={monthlyEarnings.length > 12 ? 100 : 60}
                      axisLine={false}
                      tickMargin={12}
                    />
                    
                    <YAxis
                      tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    
                    <Tooltip
                      formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "#111", fontWeight: "bold", fontSize: "14px" }}
                    />
                    
                    <Bar
                      dataKey="earnings"
                      fill="#f5a213ff"
                      radius={[12, 12, 0, 0]}
                      barSize={window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 32 : 40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-28 h-28 mx-auto mb-6" />
                <p className="text-gray-600 text-lg font-medium">No earnings yet</p>
                <p className="text-gray-400 text-sm mt-2">Your earnings will appear here once you make sales!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;