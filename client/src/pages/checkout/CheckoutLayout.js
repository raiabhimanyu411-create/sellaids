import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartStep from "./CartStep";
import ReviewStep from "./ReviewStep";
import PaymentStep from "./PaymentStep";

const steps = ["Cart", "Review", "Payment"];
const STORAGE_KEY = "checkout_order_data";

export default function CheckoutLayout() {
  const [step, setStep] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  // **ALWAYS START ON CART - CLEAR OLD DATA**
  useEffect(() => {
    // Clear any existing checkout data
    sessionStorage.removeItem(STORAGE_KEY);
    setOrderData(null);
    setStep(0); // FORCE STEP 0 (CART)
  }, []);

  // Save to sessionStorage ONLY when moving forward
  useEffect(() => {
    if (orderData && step > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orderData));
    } else if (step === 0) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [orderData, step]);

  const goNext = (data) => {
    setOrderData(data);
    setStep((s) => s + 1);
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const handleAddressUpdate = (newAddress) => {
    setOrderData((prev) => ({ ...prev, shippingAddress: newAddress }));
  };

  const handleCheckoutComplete = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setOrderData(null);
    setStep(0);
    navigate("/user/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PROGRESS BAR */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${i < step
                    ? "bg-green-600 text-white"
                    : i === step
                    ? "bg-purple-600 text-white"
                    : "bg-gray-300 text-gray-600"}`}
              >
                {i + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:inline">{label}</span>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    i < step ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className=" mx-auto">
        {step === 0 && <CartStep onNext={goNext} />}
        {step === 1 && (
          <ReviewStep
            orderData={orderData}
            onPrev={goPrev}
            onNext={goNext}
            onAddressUpdate={handleAddressUpdate}
          />
        )}
        {step === 2 && (
          <PaymentStep
            orderData={orderData}
            onPrev={goPrev}
            onCheckoutComplete={handleCheckoutComplete}
          />
        )}
      </div>
    </div>
  );
}