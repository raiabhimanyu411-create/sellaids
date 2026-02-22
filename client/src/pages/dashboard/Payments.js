import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import useCartStore from "../../stores/useCartStore";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const CHECKOUT_STORAGE_KEY = "checkout_order_data";

export default function Payments({
  orderData: propOrderData,   // <-- new prop
  onSuccess,
  isCheckoutFlow = false,
}) {
  const { user, isAuthenticated, fetchUser } = useUserStore();
  const { clearCart } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(propOrderData);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------ */
  /* 1. Prefer prop (checkout flow) → fallback to session → API fetch   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const init = async () => {
      // 1. Checkout flow – we already have the data
      if (isCheckoutFlow && propOrderData) {
        setOrderData(propOrderData);
        setLoading(false);
        return;
      }

      // 2. Try session storage (different key for checkout)
      const saved = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (saved) {
        setOrderData(JSON.parse(saved));
        setLoading(false);
        return;
      }

      // 3. Dashboard flow – fetch latest pending order
      if (user?.id) {
        await fetchLatestOrder();
      }
      setLoading(false);
    };

    init();
  }, [propOrderData, isCheckoutFlow, user?.id]);

  const fetchLatestOrder = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payment/user/${user.id}/latest-order`,
        { withCredentials: true }
      );
      setOrderData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch latest order:", err);
      toast.error("Could not load order. Redirecting...");
      setTimeout(() => navigate("/user"), 1500);
    }
  };

  /* ------------------------------------------------------------------ */
  /* 2. Load Razorpay script (only once)                               */
  /* ------------------------------------------------------------------ */
  const loadRazorpay = async () => {
    if (window.Razorpay) {
      openPayment();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => openPayment();
    script.onerror = () => {
      toast.error("Failed to load Razorpay");
      setTimeout(() => navigate("/user"), 1500);
    };
  };

  /* ------------------------------------------------------------------ */
  /* 3. Open Razorpay modal                                             */
  /* ------------------------------------------------------------------ */
  const openPayment = () => {
    if (!window.Razorpay) return;

    const options = {
      key: orderData.key,
      order_id: orderData.razorpayOrderId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Sellaids",
      description: "Payment for your order",
      handler: async (response) => {
        try {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderIds: orderData.orderIds,
            },
            { withCredentials: true }
          );

          if (verifyRes.data.success) {
            toast.success("Payment Successful!");
            await clearCart();
            sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
            if (onSuccess) onSuccess();
            setTimeout(() => navigate("/user"), 1500);
          } else {
            toast.error("Payment verification failed!");
          }
        } catch (err) {
          toast.error("Payment verification failed!");
        }
      },
      modal: {
        ondismiss: async () => {
          toast.loading("Cancelling payment...");
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/cancel`,
              {
                razorpayOrderId: orderData.razorpayOrderId,
                orderIds: orderData.orderIds,
              },
              { withCredentials: true }
            );
            toast.dismiss();
            toast.error("Payment cancelled");
            sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
            setTimeout(() => navigate("/user"), 1000);
          } catch (err) {
            toast.dismiss();
            toast.error("Failed to cancel payment");
          }
        },
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile || "",
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* ------------------------------------------------------------------ */
  /* 4. Validation – show error UI                                      */
  /* ------------------------------------------------------------------ */
  const isValid =
    orderData?.key &&
    orderData?.razorpayOrderId &&
    orderData?.amount &&
    orderData?.currency &&
    Array.isArray(orderData?.orderIds) &&
    orderData.orderIds.length > 0;

  useEffect(() => {
    if (!loading && isValid) {
      loadRazorpay();
    }
  }, [loading, isValid]);

  /* ------------------------------------------------------------------ */
  /* 5. Render                                                          */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Toaster />
        <p className="text-gray-600 text-lg">Loading payment gateway...</p>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Toaster />
        <p className="text-red-600 text-lg">
          Invalid order data. Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Redirecting to Razorpay...
        </h1>
        <p className="text-gray-600 mb-4">
          Please wait while we open the secure payment window.
        </p>
        <div className="animate-pulse text-blue-600 font-medium">
          Initializing Payment...
        </div>
      </div>
    </div>
  );
}