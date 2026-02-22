import { useEffect, useState } from "react";
import axios from "axios";

const PaymentCommissionDashboard = () => {
  const [vendorId, setVendorId] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/management/payment-commission`,
        {
          params: { vendorId },
          withCredentials: true,
        }
      );

      setData(res?.data?.data ?? null);
    } catch (err) {
      setError("Failed to load payment & commission data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen text-gray-500">
        Loading payment & commission data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  const stats = data?.stats ?? {};
  const vendors = data?.vendors ?? [];
  const payments = data?.payments ?? [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h1 className="text-2xl font-semibold">
          Payment & Commission
        </h1>

        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="all">All Vendors</option>
          {vendors?.map((v) => (
            <option key={v?.id} value={v?.id}>
              {v?.name}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        <Stat label="Total Orders" value={stats?.totalOrders ?? 0} />
        <Stat label="Total Amount" value={`₹${stats?.totalAmount ?? 0}`} />
        <Stat
          label="Admin Commission (Success)"
          value={`₹${stats?.adminCommission ?? 0}`}
          color="green"
        />
        <Stat
          label="Vendor Payout (Success)"
          value={`₹${stats?.vendorPayout ?? 0}`}
          color="blue"
        />
        {/* <Stat
          label="Vendor Earnings"
          value={`₹${stats?.totalVendorEarning ?? 0}`}
        /> */}
        <Stat
          label="Total Pending Amount"
          value={`₹${stats?.totalPendingAmount ?? 0}`}
          color="yellow"
        />
        <Stat
          label="Total Failed Amount"
          value={`₹${stats?.totalFailedAmount ?? 0}`}
          color="red"
        />
        <Stat
          label="Total Admin Revenue"
          value={`₹${stats?.totalAdminRevenue ?? 0}`}
        />
        <Stat
          label="Operational Fees"
          value={`₹${stats?.operationalFees ?? 0}`}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white mt-6 rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-4 text-left">Sr No</th>
              <th className="px-5 py-4 text-left">Order</th>
              <th className="px-5 py-4 text-left">Amount</th>
              <th className="px-5 py-4 text-left text-green-700">
                Admin Commission
              </th>
              <th className="px-5 py-4 text-left text-blue-700">
                Vendor Payout
              </th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments?.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments?.map((p, i) => (
                <tr
                  key={p?.id}
                  className={`border-t hover:bg-gray-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    }`}
                >
                  <td className="px-5 py-4 font-medium">{i + 1}</td>
                  <td className="px-5 py-4">{p?.order_id}</td>
                  <td className="px-5 py-4 font-semibold">
                    ₹{p?.amount}
                  </td>

                  {/* ✅ FIXED */}
                  <td className="px-5 py-4 text-green-700">
                    ₹{p?.payment_status === "success"
                      ? p?.admin_commission ?? 0
                      : 0}
                  </td>

                  <td className="px-5 py-4 text-blue-700">
                    ₹{p?.payment_status === "success"
                      ? p?.vendor_earning ?? 0
                      : 0}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${p?.payment_status === "success"
                          ? "bg-green-100 text-green-700"
                          : p?.payment_status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {p?.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {p?.payment_date
                      ? new Date(p.payment_date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Stat = ({ label, value, color = "gray" }) => {
  const colorMap = {
    gray: "text-gray-800",
    yellow: "text-yellow-700",
    red: "text-red-700",
    green: "text-green-700",
    blue: "text-blue-700",
  };

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <h2 className={`text-2xl font-bold ${colorMap[color]}`}>
        {value}
      </h2>
    </div>
  );
};

export default PaymentCommissionDashboard;