import React, { useEffect, useState } from "react";
import Payments from "../../pages/dashboard/Payments";

const STORAGE_KEY = "checkout_order_data";

export default function PaymentStep({ orderData, onPrev, onCheckoutComplete }) {
  const [finalOrderData, setFinalOrderData] = useState(orderData);

  useEffect(() => {
    if (!orderData) {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setFinalOrderData(JSON.parse(saved));
    }
  }, [orderData]);

  useEffect(() => {
    if (finalOrderData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(finalOrderData));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [finalOrderData]);

  useEffect(() => {
    if (finalOrderData && !window.location.state?.orderData) {
      window.history.replaceState(
        { ...window.history.state, orderData: finalOrderData },
        ""
      );
    }
  }, [finalOrderData]);

  if (!finalOrderData) {
    return (
      <div className="text-center py-10">
        <p>Loading order data...</p>
        <button
          onClick={onPrev}
          className="mt-4 px-5 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Payments
        orderData={finalOrderData}      // <-- explicit prop
        onSuccess={onCheckoutComplete}
        isCheckoutFlow={true}
      />
      <div className="flex justify-start">
        <button
          onClick={onPrev}
          className="px-5 py-2 border rounded hover:bg-gray-100"
        >
          Back to Review
        </button>
      </div>
    </div>
  );
}