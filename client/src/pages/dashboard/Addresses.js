import React, { useEffect, useState } from "react";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";

export default function Addresses() {
  const { user } = useWishlistStore();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ label: "", address: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch addresses on dashboard load or after checkout save
  useEffect(() => {
    if (user?.id) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000api/user/${user.id}/addresses`);
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (address) => {
    setEditId(address.id);
    setForm({ label: address.label, address: address.address, phone: address.phone || "" });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ label: "", address: "", phone: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label || !form.address) {
      alert("Please fill at least label and address");
      return;
    }

    try {
      let res;
      if (editId) {
        // Update existing
        res = await axios.put(
          `http://localhost:5000api/user/${user.id}/addresses/${editId}`,
          form
        );
      } else {
        // Add new
        res = await axios.post(`http://localhost:5000api/user/${user.id}/addresses`, form);
      }

      setAddresses(res.data);
      handleCancelEdit();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this address?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000api/user/${user.id}/addresses/${id}`);
      setAddresses(res.data);
      if (editId === id) handleCancelEdit();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete address");
    }
  };

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Address</h1>

      {/* Addresses List */}
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{addr.label}</p>
            <p>{addr.address}</p>
            {addr.phone && <p className="text-sm text-gray-500">Phone: {addr.phone}</p>}
          </div>
          <div className="flex gap-2">
            {!showForm && (
              <button
                onClick={() => handleEditClick(addr)}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Edit
              </button>
            )}
            {showForm && editId === addr.id && (
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Edit/Add Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl shadow space-y-4 max-w-md"
        >
          <input
            type="text"
            name="label"
            placeholder="Label (e.g. Home, Office)"
            value={form.label}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              {editId ? "Update Address" : "+ Add New Address"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
