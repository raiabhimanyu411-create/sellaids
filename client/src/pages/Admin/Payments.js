import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/management/payment`,
        {
          params: {
            transaction_id: transactionId, // ✅ backend expects this name
            status: statusFilter, // ✅ matches backend
            start_date: startDate, // ✅ matches backend
            end_date: endDate, // ✅ matches backend
            page: currentPage,
            limit,
          },
          withCredentials: true,
        }
      );

      const { success, data, message } = res.data;

      if (success) {
        setPayments(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        if (message) toast.success(message);
      } else {
        setPayments([]);
        toast.error(message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on filter/pagination change (not typing)
  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter, startDate, endDate]);

  // Search button handler
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPayments();
  };

  const exportExcel = () => {
    if (!payments.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
      payments.map((p, idx) => ({
        SR: (currentPage - 1) * limit + idx + 1,
        "Payment ID": p.id,
        "Order ID": p.order_id,
        Vendor: p.vendor_id,
        Amount: p.amount,
        Commission: p.platform_fee,
        "Vendor Payout": p.vendor_earning,
        Status: p.payment_status,
        Method: p.payment_method,
        "Transaction ID": p.transaction_id,
        "Payment Date": p.payment_date,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payments_Report.xlsx");
  };

  return (
    <div className="p-3 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Payments & Transactions</h2>
        <button
          onClick={exportExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 w-full bg-white shadow-sm p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by Transaction ID..."
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-[#FF6A00] text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
        <select
          className="border rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setCurrentPage(1);
          }}
        />
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="text-center p-6 text-gray-500">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            No transactions available.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-3 border">SR.</th>
                <th className="p-3 border">Payment ID</th>
                <th className="p-3 border">Order ID</th>
                {/* <th className="p-3 border">Vendor ID</th> */}
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Commission</th>
                <th className="p-3 border">Vendor Payout</th>
                <th className="p-3 border">Status</th>
                {/* <th className="p-3 border">Method</th> */}
                <th className="p-3 border">Transaction ID</th>
                <th className="p-3 border">Payment Date</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="p-3 border text-blue-600">{p.id}</td>
                  <td className="p-3 border">{p.order_id}</td>
                  {/* <td className="p-3 border">{p.vendor_id}</td> */}
                  <td className="p-3 border font-bold">{p.amount}</td>
                  <td className="p-3 border text-green-600">{p.platform_fee}</td>
                  <td className="p-3 border text-blue-600">
                    {p.vendor_earning}
                  </td>
                  <td className="p-3 border capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${p.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : p.payment_status === "success"
                          ? "bg-green-100 text-green-800"
                          : p.payment_status === "failed"
                            ? "bg-red-100 text-red-800"
                            : p.payment_status === "refunded"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {p.payment_status}
                    </span>
                  </td>
                  {/* <td className="p-3 border">{p.payment_method}</td> */}
                  <td className="p-3 border break-all whitespace-normal max-w-[160px]">
                    {p.transaction_id}
                  </td>
                  <td className="p-3 border">
                    {p.payment_date
                      ? new Date(p.payment_date).toISOString().split("T")[0]
                      : "-"}
                  </td>
                  <td className="p-3 border text-center">
                    <Eye
                      className="h-4 w-4 text-blue-600 cursor-pointer inline-block"
                      onClick={() => setSelectedPayment(p)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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

      {/* Payment Modal */}
      {selectedPayment && (
        <div className="fixed -inset-6 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-xl"
              onClick={() => setSelectedPayment(null)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Payment Details</h3>
            {Object.entries(selectedPayment).map(([key, value]) => (
              <p key={key} className="text-sm mb-1">
                <strong className="capitalize">{key}:</strong>{" "}
                {value?.toString()}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
