import React, { useState, useEffect } from "react";

const OrderTable = ({ orders }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFilteredOrders(orders); // initialize
  }, [orders]);

  const handleSearch = () => {
    const filtered = orders.filter(order =>
      order.product_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  if (!filteredOrders.length) return <p className="p-4">No orders found.</p>;

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-red-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Search
        </button>
      </div>

      {/* Orders Table */}
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-2 border">orderId</th>
            <th className="px-4 py-2 border">productName</th>
            <th className="px-4 py-2 border">price</th>
            <th className="px-4 py-2 border">quantity</th>
            <th className="px-4 py-2 border">status</th>
            <th className="px-4 py-2 border">date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{order.id}</td>
              <td className="px-4 py-2 border">{order.product_name}</td>
              <td className="px-4 py-2 border">₹{order.price}</td>
              <td className="px-4 py-2 border">{order.quantity}</td>
              <td className="px-4 py-2 border font-semibold text-blue-600">{order.status}</td>
              <td className="px-4 py-2 border">{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
