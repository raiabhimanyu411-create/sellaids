import { useState } from "react";

const tabs = ["Login Logs", "Action Logs", "Security Alerts"];

const logs = [
  {
    user: "admin@platform.com",
    role: "Admin",
    action: "Login Success",
    ip: "192.168.1.100",
    location: "Karachi, Pakistan",
    device: "Chrome on Windows",
    time: "2024-03-15 10:30:25",
    status: "Success",
  },
  {
    user: "ahmad.ali@email.com",
    role: "Vendor",
    action: "Login Failed",
    ip: "192.168.1.101",
    location: "Lahore, Pakistan",
    device: "Firefox on Mac",
    time: "2024-03-15 09:15:42",
    status: "Failed",
  },
  {
    user: "fatima.khan@email.com",
    role: "Customer",
    action: "Login Success",
    ip: "192.168.1.102",
    location: "Islamabad, Pakistan",
    device: "Safari on iPhone",
    time: "2024-03-15 08:45:18",
    status: "Success",
  },
  {
    user: "hassan.ahmed@email.com",
    role: "Vendor",
    action: "Password Reset",
    ip: "192.168.1.103",
    location: "Faisalabad, Pakistan",
    device: "Chrome on Android",
    time: "2024-03-14 16:22:33",
    status: "Success",
  },
  // Add more logs as needed...
];

export default function SecurityLogs() {
  const [activeTab, setActiveTab] = useState("Login Logs");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 3;

  const filteredLogs = logs.filter((log) =>
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  return (
    <div className="p-6 bg-white shadow rounded-lg max-w-7xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Security & Logs</h2>
          <p className="text-gray-500">Monitor system security and track user activities</p>
        </div>
        <div className="space-x-2">
          <button className="bg-gray-100 px-4 py-2 rounded border hover:bg-gray-200">
            🛡️ Security Scan
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            📁 Export Logs
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Security Score" value="95%" subtitle="Excellent" color="green" />
        <Card title="Login Attempts" value="1,234" subtitle="Last 24 hours" color="blue" />
        <Card title="Security Alerts" value="12" subtitle="3 active" color="red" />
        <Card title="Blocked IPs" value="45" subtitle="Auto-blocked" color="yellow" />
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 -mb-px border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Device</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{log.user}</div>
                  <div className="text-gray-500 text-xs">{log.role}</div>
                </td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{log.ip}</td>
                <td className="px-4 py-2">{log.location}</td>
                <td className="px-4 py-2">{log.device}</td>
                <td className="px-4 py-2">{log.time}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      log.status === "Success"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {paginatedLogs.length} of {filteredLogs.length} logs
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-1 text-sm">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, subtitle, color }) {
  const colorClasses = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <div className="p-4 border rounded bg-white">
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className={`text-sm mt-1 inline-block px-2 py-0.5 rounded ${colorClasses[color]}`}>
        {subtitle}
      </div>
    </div>
  );
}
