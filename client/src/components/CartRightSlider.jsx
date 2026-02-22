import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartRightSlider = ({
  open,
  onClose,
  product, // { product_id, user_id }
}) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate();

  /* =========================
     🔒 BODY SCROLL LOCK
     ========================= */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);


  const handleCloseSlider = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 350); // same as animation duration
  };


  /* =========================
     🔥 FETCH FULL CART
     ========================= */
  useEffect(() => {
    if (!open) return;

    const fetchCart = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/cart`,
          { withCredentials: true }
        );

        if (res.data?.success) {
          setCartItems(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [open]);

  if (!open) return null;

  /* =========================
     🗑 REMOVE SINGLE PRODUCT
     ========================= */
  const handleRemoveSingle = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/cart/${productId}`,
        { withCredentials: true }
      );

      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove product");
    }
  };

  /* =========================
     🗑 REMOVE ALL PRODUCTS
     ========================= */
  const handleRemoveAll = async () => {
    try {
      for (const item of cartItems) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/cart/${item.product_id}`,
          { withCredentials: true }
        );
      }
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart");
    }
  };

  /* =========================
     ➡️ CONTINUE → CHECKOUT
     ========================= */
  const handleContinueCheckout = async () => {
    onClose();
    navigate("/user/checkout");
  };

  /* =========================
     💰 GRAND TOTAL
     ========================= */
  const cartTotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item?.product?.price || 0) * (item?.quantity || 1),
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 pointer-events-auto"
      />
      {/* Slider */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col ${isClosing ? "animate-slide-out" : "animate-slide-in"
          }`}
        onClick={(e) => e.stopPropagation()}
      >


        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            Added to Cart
          </h3>
          <button onClick={handleCloseSlider}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading cart...</p>
          </div>
        )}

        {/* =========================
            🛒 CART ITEMS (SCROLLABLE)
           ========================= */}
        {!loading && cartItems.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.product_id}
                  className="p-5 flex gap-4 border-b relative"
                >
                  {/* LEFT REMOVE ICON */}
                  <button
                    onClick={() => handleRemoveSingle(item.product_id)}
                    className="absolute top-14 left-3 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>

                  <img
                    src={
                      item?.product?.front_photo
                        ? `${import.meta.env.VITE_API_URL}/${item.product.front_photo}`
                        : ""
                    }
                    alt={item?.product?.name || "Product"}
                    className="w-20 h-24 object-cover rounded-lg border ml-6"
                  />

                  <div className="flex-1">
                    <p className="font-medium line-clamp-2">
                      {item?.product?.name}
                    </p>

                    <p className="text-orange-600 font-bold mt-1">
                      ₹{item?.product?.price?.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item?.quantity}
                    </p>

                  </div>
                </div>
              ))}
            </div>

            {/* =========================
                💰 GRAND TOTAL
               ========================= */}
            <div className="px-5 py-3 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="p-5 space-y-3">
              <button
                onClick={handleRemoveAll}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
                Remove
              </button>

              <button
                onClick={handleContinueCheckout}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700"
              >
                Checkout
              </button>
            </div>
          </>
        )}

        {/* EMPTY CART */}
        {!loading && cartItems.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Cart is empty
          </div>
        )}
      </div>

      {/* Animation */}
      <style>
        {`
    /* ===== SLIDE IN ===== */
    .animate-slide-in {
      animation: slideIn 0.35s ease-out forwards;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    /* ===== SLIDE OUT ===== */
    .animate-slide-out {
      animation: slideOut 0.35s ease-in forwards;
    }
    @keyframes slideOut {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `}
      </style>

    </>
  );
};

export default CartRightSlider;