import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import UserFooter from "../../components/UserFooter";

export default function Support() {
  const [data, setData] = useState({
    email: "contact@sellaids.com",
    phone: "+91 8800425855",
    tickets: []
  });
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 4;

  useEffect(() => {
    fetchSupport();
  }, []);

  const fetchSupport = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/support`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setData({
          email: res.data.data.email || "contact@sellaids.com",
          phone: res.data.data.phone || "+91 8800425855",
          tickets: res.data.data.tickets || []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = data.tickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.tickets.length / ticketsPerPage);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      {/* Card Start */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

        <div className="bg-gray-50 p-5 rounded-lg mb-8">
          <p className="text-gray-700 mb-4">Need help? Contact us anytime:</p>
          <div className="space-y-2 text-lg">
            <p>Email: <a href={`mailto:${data.email}`} className="text-red-600 font-bold">{data.email}</a></p>
            <p>Phone: <a href={`tel:${data.phone}`} className="text-red-600 font-bold">{data.phone}</a></p>
          </div>
          <Link to="/user/raise-ticket">
            <button className="mt-5 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium">
              Raise a Ticket
            </button>
          </Link>
        </div>

        <h2 className="text-xl font-bold mb-4">Your Support Tickets</h2>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading your tickets...</p>
        ) : data.tickets.length === 0 ? (
          <p className="text-center text-gray-600 py-10 text-lg">
            No tickets found. Create your first support ticket!
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left">Sr. No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Title</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Message</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.map((ticket, index) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{indexOfFirst + index + 1}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium">{ticket.title}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{ticket.message}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                        {new Date(ticket.created_at).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      
      </div>
      {/* ✅ Footer inside card */}
        <div className="mt-8">
          <UserFooter />
        </div>
    </div>
  );
}