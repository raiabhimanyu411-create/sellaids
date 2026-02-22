// src/components/Navbar.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";

export default function Navbar({ toggleSidebar }) {
  const { user } = useUserStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white shadow border-b sticky top-0 z-50">
      
      {/* Left: Hamburger + Welcome Text */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-700 hover:text-gray-900"
        >
          <Menu size={28} strokeWidth={2.5} />
        </button>

        {/* Welcome Message */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Welcome,{" "}
          <span className="text-red-600">{user?.name || "User"}</span>
        </h1>
      </div>

      {/* Right: Cart Icon */}
      <button
        onClick={() => navigate("/user/checkout")}
        className="relative text-gray-700 hover:text-blue-600 transition-colors p-2"
        title="Cart"
      >
        <ShoppingCart size={26} strokeWidth={2} />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {cartItemCount > 99 ? "99+" : cartItemCount}
          </span>
        )}
      </button>
    </div>
  );
}