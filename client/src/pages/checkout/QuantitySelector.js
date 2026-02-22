import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import useCartStore from "../../stores/useCartStore";

export default function QuantitySelector({ productId, initialQty, disabled = false }) {
  const [qty, setQty] = useState(initialQty);
  const [updating, setUpdating] = useState(false);
  const { fetchCart } = useCartStore();

  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  const updateQuantity = async (newQty) => {
    if (newQty < 0 || updating || disabled) return;

    setUpdating(true);
    try {
      await api.put(`/api/user/cart/${productId}`, { quantity: newQty });
      setQty(newQty);
      await fetchCart();
      toast.success("Quantity updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
      setQty(initialQty);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md w-fit select-none">
      <button
        onClick={() => updateQuantity(qty - 1)}
        disabled={updating || qty <= 1 || disabled}
        className={`
          px-3 py-1 text-gray-700 font-medium text-lg
          hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150
          ${qty <= 1 ? "rounded-l-md" : ""}
        `}
      >
        –
      </button>

      <span
        className={`
          px-4 py-1 text-sm font-semibold min-w-[40px] text-center
          ${updating ? "text-gray-500" : "text-gray-900"}
        `}
      >
        {updating ? "..." : qty}
      </span>

      <button
        onClick={() => updateQuantity(qty + 1)}
        disabled={updating || disabled}
        className={`
          px-3 py-1 text-gray-700 font-medium text-lg
          hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150 rounded-r-md
        `}
      >
        +
      </button>
    </div>
  );
}