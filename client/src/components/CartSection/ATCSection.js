// src/components/CartSection/ATCSection.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

import { useUserStore } from '../../stores/useUserStore';
import useCartStore from "../../stores/useCartStore";

const ATCSection = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, isUserLoading } = useUserStore();
  const { cart, fetchCart } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);

  // Fixed Fees
  const SHIPPING_FEE = 100;
  const PLATFORM_FEE = 50;

  // Auth guard
  useEffect(() => {
    if (isUserLoading) return;

    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to view your cart");
      setTimeout(() => {
        navigate("/UserAuth/UserLogin", {
          state: { from: window.location.pathname },
        });
      }, 1500);
      return;
    }

    fetchCart();
  }, [isAuthenticated, isUserLoading, user, navigate, fetchCart]);

  // API helpers
  const api = {
    updateQty: async (productId, quantity) => {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      return res.data;
    },
    deleteItem: async (productId) => {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/cart/${productId}`,
        { withCredentials: true }
      );
      return res.data;
    },
    applyCoupon: async (code) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/cart/coupon`,
        { coupon_code: code },
        { withCredentials: true }
      );
      return res.data;
    },
  };

  // Handlers
  const updateQuantity = async (productId, type) => {
    const item = cart.find((i) => i.product_id === productId);
    if (!item) return;

    const newQty = type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    try {
      await api.updateQty(productId, newQty);
      toast.success("Quantity updated");
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.deleteItem(productId);
      toast.success("Item removed");
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      await api.applyCoupon(couponCode);
      toast.success("Coupon applied!");
      await fetchCart();
      setCouponCode("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally {
      setApplying(false);
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const total = subtotal + SHIPPING_FEE + PLATFORM_FEE;

  // Render
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10 md:mt-20">
      <Toaster position="top-right" />

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-6 py-16 bg-white rounded-xl shadow-lg">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-32 h-32 mb-6 opacity-70"
          />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Your Cart is Empty
          </h3>
          <p className="text-gray-600 mb-8 max-w-md">
            Looks like you haven’t added anything yet.
          </p>
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Price</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-center">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const p = item.product;
                  const itemTotal = (p.price * item.quantity).toFixed(2);

                  return (
                    <tr key={item.product_id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 flex gap-4 items-center">
                        <img
                          src={p.front_photo || "https://via.placeholder.com/100"}
                          alt={p.name}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-2">{p.name}</p>
                          {p.color && <p className="text-xs text-gray-500 mt-1">Color: {p.color}</p>}
                          {p.size && <p className="text-xs text-gray-500">Size: {p.size}</p>}
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="text-red-500 text-xs hover:underline mt-2 block"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">₹{p.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center border rounded-lg w-28 mx-auto">
                          <button onClick={() => updateQuantity(item.product_id, "dec")} className="px-3 py-1 text-gray-600 hover:bg-gray-100">−</button>
                          <span className="px-4 font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, "inc")} className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">₹{itemTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Coupon + Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-5 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-1/2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={applying}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {applying ? "Applying…" : "APPLY COUPON"}
              </button>
            </div>

            <div className="flex gap-3 w-full md:w-auto justify-end">
              <button onClick={fetchCart} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
                UPDATE CART
              </button>
              <Link to="/" className="border border-gray-300 px-6 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* PRICE BREAKDOWN */}
          <div className="px-6 py-5 border-t bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="font-medium text-green-600">₹{SHIPPING_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium text-green-600">₹{PLATFORM_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-300">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-orange-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* PROCEED TO CHECKOUT */}
            <div className="mt-6 text-right">
              <Link
                to="/checkout"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-md transition transform hover:scale-105"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATCSection;