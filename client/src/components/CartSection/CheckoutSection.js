// src/pages/CheckoutPage.jsx
import React, { useState } from "react";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Dark Green Gown With Front And Back Feather And Sequin Work",
      price: 8999,
      image: "https://via.placeholder.com/80",
      quantity: 1,
    },
    {
      id: 2,
      name: "Red Designer Saree With Embroidery",
      price: 4999,
      image: "https://via.placeholder.com/80",
      quantity: 1,
    },
  ]);

  const [shippingOption, setShippingOption] = useState("platform");
  const [paymentOption, setPaymentOption] = useState("cod");
  const [addNote, setAddNote] = useState(false);
  const [note, setNote] = useState("");
  const [sameBilling, setSameBilling] = useState(true);

  const handleQuantityChange = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "increase"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = shippingOption === "platform" ? 50 : 70;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 md:mt-20">
      {/* LEFT COLUMN */}
      <div className="md:col-span-2 space-y-8">
        <h1 className="text-3xl font-heading mb-6">CHECKOUT</h1>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold">CONTACT INFORMATION</h2>
          <p className="text-sm text-gray-600 mb-3">
            We'll use this email to send you details and updates about your
            order.
          </p>
          <input
            type="email"
            placeholder="Email address"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="text-lg font-semibold">SHIPPING ADDRESS</h2>
          <select className="w-full border px-3 py-2 rounded mb-3">
            <option>India</option>
          </select>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input type="text" placeholder="First name" className="border px-3 py-2 rounded" />
            <input type="text" placeholder="Last name" className="border px-3 py-2 rounded" />
          </div>
          <input type="text" placeholder="Address" className="w-full border px-3 py-2 rounded mb-3" />
          <input type="text" placeholder="+ Add apartment, suite, etc." className="w-full border px-3 py-2 rounded mb-3" />
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input type="text" placeholder="City" className="border px-3 py-2 rounded" />
            <select className="border px-3 py-2 rounded">
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input type="text" placeholder="PIN Code" className="border px-3 py-2 rounded" />
            <input type="text" placeholder="Phone" className="border px-3 py-2 rounded" />
          </div>

          {/* Checkbox for Billing */}
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={sameBilling}
              onChange={(e) => setSameBilling(e.target.checked)}
            />
            Use same address for billing
          </label>
        </div>

        {/* Billing Address (Only if unchecked) */}
        {!sameBilling && (
          <div>
            <h2 className="text-lg font-semibold mt-6">BILLING ADDRESS</h2>
            <div className="grid grid-cols-2 gap-4 mb-3 mt-3">
              <input type="text" placeholder="First name" className="border px-3 py-2 rounded" />
              <input type="text" placeholder="Last name" className="border px-3 py-2 rounded" />
            </div>
            <input type="text" placeholder="Address" className="w-full border px-3 py-2 rounded mb-3" />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input type="text" placeholder="City" className="border px-3 py-2 rounded" />
              <select className="border px-3 py-2 rounded">
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input type="text" placeholder="PIN Code" className="border px-3 py-2 rounded" />
              <input type="text" placeholder="Phone" className="border px-3 py-2 rounded" />
            </div>
          </div>
        )}

        {/* Shipping Options */}
        <div>
          <h2 className="text-lg font-semibold">SHIPPING OPTIONS</h2>
          <div className="border rounded divide-y mt-2">
            <label className="flex justify-between items-center px-4 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shippingOption"
                  value="platform"
                  checked={shippingOption === "platform"}
                  onChange={(e) => setShippingOption(e.target.value)}
                />
                Platform Fee
              </div>
              <span>₹50.00</span>
            </label>
            <label className="flex justify-between items-center px-4 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shippingOption"
                  value="shipping"
                  checked={shippingOption === "shipping"}
                  onChange={(e) => setShippingOption(e.target.value)}
                />
                Shipping Fee
              </div>
              <span>₹70.00</span>
            </label>
          </div>
        </div>

        {/* Payment Options */}
        <div>
          <h2 className="text-lg font-semibold">PAYMENT OPTIONS</h2>
          <div className="border rounded divide-y mt-2">
            <label className="flex items-center gap-2 px-4 py-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentOption === "cod"}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
                alt="Cash on Delivery"
                className="w-6 h-6"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 px-4 py-2">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentOption === "razorpay"}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
                alt="Razorpay"
                className="w-20 h-6 object-contain"
              />
              Pay by Razorpay
            </label>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <input
              type="checkbox"
              checked={addNote}
              onChange={(e) => setAddNote(e.target.checked)}
            />
            Add a note to your order
          </label>
          {addNote && (
            <textarea
              placeholder="Write your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          )}
        </div>

        {/* Terms */}
        <p className="text-sm text-gray-600 mb-6">
          By proceeding with your purchase you agree to our{" "}
          <a href="#" className="underline">Terms and Conditions</a>{" "}
          and{" "}
          <a href="#" className="underline">Privacy Policy</a>
        </p>

        {/* Back to Cart link only */}
        <button
          className="text-sm underline"
          onClick={() => (window.location.href = "/addtocart")}
        >
          ← Return to Cart
        </button>
      </div>

      {/* RIGHT COLUMN - ORDER SUMMARY */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-lg font-semibold mb-4">ORDER SUMMARY</h2>
        <div className="space-y-4">
          {cartItems.map((item, idx) => (
            <div key={item.id}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, "decrease")}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, "increase")}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
              </div>
              {/* Divider between products */}
              {idx < cartItems.length - 1 && <hr className="my-3" />}
            </div>
          ))}

          <div className="flex justify-between text-sm pt-3 border-t">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{shippingOption === "platform" ? "Platform Fee" : "Shipping Fee"}</span>
            <span>₹{shippingFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* PLACE ORDER button under order summary */}
        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
