import React, { useState, useEffect } from "react";
import { MapPin, Truck, Package } from "lucide-react";
import api from "../../api/axiosInstance";
import { toast, Toaster } from "react-hot-toast";

const IMG_BASE = import.meta.env.VITE_API_URL;

export default function ReviewStep({
  orderData,
  onPrev,
  onNext,
  onAddressUpdate,
}) {
  const {
    cartItems = [],
    shippingAddress: parentAddress = "",
    total = 0,
    finalTotal = 0,
    shippingFee = 100,
    platformFee = 50,
  } = orderData || {};

  const [shippingAddress, setShippingAddress] = useState(parentAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [addr, setAddr] = useState({ line: "", city: "", pin: "" });
  const [loading, setLoading] = useState(false);

  const parseAddress = (addr) => {
    const parts = addr.split(", ");
    if (parts.length === 3) {
      return { line: parts[0], city: parts[1], pin: parts[2] };
    }
    return { line: "", city: "", pin: "" };
  };

  useEffect(() => {
    if (parentAddress) {
      setShippingAddress(parentAddress);
      setAddr(parseAddress(parentAddress));
    }
  }, [parentAddress]);

  const saveAddress = async () => {
    const { line, city, pin } = addr;
    if (!line || !city || !pin) {
      toast.error("Please fill all address fields");
      return;
    }

    const full = `${line}, ${city}, ${pin}`;

    try {
      await api.put("/api/user/profile/edit", {
        address_line: line,
        city,
        pincode: pin,
      });

      setShippingAddress(full);
      setAddr({ line, city, pin });
      onAddressUpdate(full);
      setIsEditing(false);
      toast.success("Address saved");
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const cancelEdit = () => {
    setAddr(parseAddress(shippingAddress));
    setIsEditing(false);
  };

  /* ---------- IMAGE SLIDER LOGIC ---------- */
  const [activeImages, setActiveImages] = useState({});

  const getProductImages = (product) => {
    if (!product) return [];
    const moreImages = (() => {
      try {
        return JSON.parse(product.more_images || "[]") || [];
      } catch {
        return [];
      }
    })();
    return [
      product.front_photo,
      product.back_photo,
      product.label_photo,
      product.inside_photo,
      product.button_photo,
      product.wearing_photo,
      ...moreImages,
    ].filter(Boolean)
    .map(path => `${IMG_BASE}/${path}`);
  };

  const changeImage = (productId, offsetOrIndex) => {
    setActiveImages((prev) => {
      const current = prev[productId] ?? 0;
      const images = getProductImages(
        cartItems.find((i) => i.product_id === productId)?.product || {}
      );
      if (images.length === 0) return prev;

      let newIdx;
      if (typeof offsetOrIndex === "number") {
        if (offsetOrIndex < 0) {
          newIdx = (current + offsetOrIndex + images.length) % images.length;
        } else if (offsetOrIndex === 1) {
          newIdx = (current + 1) % images.length;
        } else {
          newIdx = offsetOrIndex;
        }
      } else {
        newIdx = (current + 1) % images.length;
      }
      return { ...prev, [productId]: newIdx };
    });
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/96";
  };

  /* ---------- PROCEED TO PAYMENT ---------- */
  const handleProceed = async () => {
    if (!shippingAddress) {
      toast.error("Please add a shipping address");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/payment/create-order", {
        cartItems,
        shippingAddress,
        finalTotal,
      });

      if (!res.data.success) throw new Error(res.data.message);

      const razorpayData = res.data.data;
      const fullOrderData = {
        ...orderData,
        ...razorpayData,
        finalTotal,
        shippingFee,
        platformFee,
      };

      onNext(fullOrderData);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 py-4">
      <Toaster />
      <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Review Your Order</h2>

      {/* ADDRESS CARD - Responsive */}
      <div className="bg-white rounded-lg shadow-sm border p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
        <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
            <p className="font-semibold text-lg">Delivery Address</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 text-sm underline hover:text-purple-700"
            >
              Change
            </button>
          </div>

          {isEditing ? (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  placeholder="Address line"
                  value={addr.line}
                  onChange={(e) => setAddr({ ...addr, line: e.target.value })}
                  className="border rounded-lg px-4 py-3 text-sm w-full"
                />
                <input
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  className="border rounded-lg px-4 py-3 text-sm w-full"
                />
                <input
                  placeholder="Pincode"
                  value={addr.pin}
                  onChange={(e) => setAddr({ ...addr, pin: e.target.value })}
                  className="border rounded-lg px-4 py-3 text-sm w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveAddress}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-base mt-1">
              {shippingAddress || "No address set"}
            </p>
          )}
        </div>
      </div>

      {/* PRODUCT ITEMS - Fully Responsive */}
      {cartItems.map((item) => {
        const product = item.product;
        const images = getProductImages(product);
        const activeIdx = activeImages[item.product_id] ?? 0;

        return (
          <div
            key={item.product_id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-6 items-start">
              {/* Image Slider */}
              <div className="w-full lg:w-64 flex-shrink-0">
                <div className="relative">
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={images[activeIdx] || "https://via.placeholder.com/300"}
                      alt={product?.name}
                      className="w-full h-full object-contain"
                      onError={handleImageError}
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 pointer-events-none">
                      <button
                        onClick={() => changeImage(item.product_id, -1)}
                        className="pointer-events-auto bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => changeImage(item.product_id, 1)}
                        className="pointer-events-auto bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => changeImage(item.product_id, idx)}
                          className={`flex-shrink-0 snap-center border-2 rounded-md overflow-hidden transition-all ${
                            activeIdx === idx ? "border-purple-600" : "border-gray-200"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`thumb ${idx + 1}`}
                            className="w-16 h-16 object-cover"
                            onError={handleImageError}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-3 min-w-0">
                <h3 className="font-semibold text-lg">{product?.name}</h3>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-xl">₹{product?.price * item.quantity}</span>
                  {product?.original_price > product?.price && (
                    <>
                      <span className="text-gray-500 line-through text-base">
                        ₹{product?.original_price * item.quantity}
                      </span>
                      <span className="text-green-600 font-medium">
                        {Math.round(
                          ((product.original_price - product.price) / product.original_price) * 100
                        )}% off
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  {product.size && <span>Size: {product.size === 'Other' ? product.size_other : product.size}</span>} 
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* PRICE SUMMARY */}
      <div className="bg-white rounded-lg shadow-sm border p-5 sm:p-6">
        <div className="space-y-3 text-base">
          <div className="flex justify-between">
            <span>Product Total</span>
            <span className="font-medium">₹{total}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">₹{shippingFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span className="text-green-600">₹{platformFee}</span>
          </div>
          <div className="pt-4 border-t-2 border-gray-200 flex justify-between text-lg font-bold">
            <span>Final Total</span>
            <span className="text-purple-600 text-xl">₹{finalTotal}</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button
          onClick={onPrev}
          className="w-full sm:w-auto px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition text-base"
        >
          Back
        </button>
        <button
          onClick={handleProceed}
          disabled={isEditing || loading || !shippingAddress}
          className="w-full sm:w-auto px-10 py-3.5 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? "Creating Order..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}