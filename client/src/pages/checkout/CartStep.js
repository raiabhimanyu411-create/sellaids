import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../stores/useCartStore";
import useWishlistStore from "../../stores/useWishlistStore";
import api from "../../api/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import { MapPin, Heart, X, Truck, Package } from "lucide-react";
import QuantitySelector from "../../pages/checkout/QuantitySelector";

const STORAGE_KEY = "orderData";
const IMG_BASE = import.meta.env.VITE_API_URL;

export default function CartStep({ onNext }) {
  const { cart, fetchCart, removeFromCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();

  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addr, setAddr] = useState({ line: "", city: "", pin: "" });
  const [originalAddr, setOriginalAddr] = useState("");

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const debounceRef = useRef(null);

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

  const handleAddressTyping = (value) => {
    setAddr((prev) => ({ ...prev, line: value }));

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${value}`
        );
        const data = await res.json();
        setAddressSuggestions(data);
      } catch {
        setAddressSuggestions([]);
      }
    }, 400);
  };

  const selectAddressSuggestion = (item) => {
    setAddr({
      line: item.display_name,
      city:
        item.address.city ||
        item.address.town ||
        item.address.village ||
        "",
      pin: item.address.postcode || "",
    });
    setAddressSuggestions([]);
  };


  const changeImage = (productId, offsetOrIndex) => {
    setActiveImages((prev) => {
      const current = prev[productId] ?? 0;
      const images = getProductImages(
        cart.find((i) => i.product_id === productId)?.product || {}
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

  // CLEAR OLD CHECKOUT DATA ON MOUNT
  useEffect(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    api
      .get("/api/user/profile/list")
      .then((res) => {
        const d = res.data.data;
        if (d.address_line && d.city && d.pincode) {
          const full = `${d.address_line}, ${d.city}, ${d.pincode}`;
          setShippingAddress(full);
          setOriginalAddr(full);
          setAddr({ line: d.address_line, city: d.city, pin: d.pincode });
        }
      })
      .catch(() => toast.error("Could not load address"))
      .finally(() => fetchCart().then(() => setLoading(false)));
  }, [fetchCart]);

  const moveToWishlist = async (pidId) => {
    try {
      await api.post("/api/user/wishlist", { product_id: pidId });
      await addToWishlist(pidId);
      await removeFromCart(pidId);
      toast.success("Moved to wishlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

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
      setOriginalAddr(full);
      setIsEditing(false);
      toast.success("Address saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    }
  };

  const cancelEdit = () => {
    const parts = originalAddr.split(", ");
    if (parts.length === 3) {
      setAddr({ line: parts[0], city: parts[1], pin: parts[2] });
    } else {
      setAddr({ line: "", city: "", pin: "" });
    }
    setIsEditing(false);
  };

  const handleContinue = () => {
    if (!shippingAddress) return toast.error("Add a shipping address");

    const totalProductPrice = cart.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0
    );

    const SHIPPING_FEE = 100;
    const PLATFORM_FEE = 50;

    const finalTotal = totalProductPrice + SHIPPING_FEE + PLATFORM_FEE;

    onNext({
      cartItems: cart,
      shippingAddress,
      total: totalProductPrice,
      finalTotal,
      shippingFee: SHIPPING_FEE,
      platformFee: PLATFORM_FEE,
    });

  };

  if (loading) return <p className="text-center py-10">Loading…</p>;

  const totalProductPrice = cart.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  const orderTotal = totalProductPrice;
  const SHIPPING_FEE = 100;
  const PLATFORM_FEE = 50;
  const finalTotal = orderTotal + SHIPPING_FEE + PLATFORM_FEE;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Toaster />

      {/* ADDRESS CARD - Responsive */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mt-1 flex-shrink-0" />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3">
            <p className="font-semibold text-base sm:text-lg">Delivery Address</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 text-sm underline hover:text-purple-700"
            >
              Change
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4 mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <input
                    placeholder="Address line"
                    value={addr.line}
                    onChange={(e) => handleAddressTyping(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full"
                  />

                  {addressSuggestions.length > 0 && (
                    <ul className="absolute z-20 bg-white border rounded mt-1 w-full max-h-48 overflow-auto shadow">
                      {addressSuggestions.map((item) => (
                        <li
                          key={item.place_id}
                          onClick={() => selectAddressSuggestion(item)}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                          {item.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <input
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Pincode"
                  value={addr.pin}
                  onChange={(e) => setAddr({ ...addr, pin: e.target.value })}
                  className="border rounded px-3 py-2 text-sm w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveAddress}
                  className="px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-1.5 border rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm sm:text-base">{shippingAddress || "No address added yet"}</p>
          )}
        </div>
      </div>

      {/* PRODUCT CARDS - Fully Responsive */}
      {cart.map((item) => {
        const product = item.product;
        const images = getProductImages(product);
        const activeIdx = activeImages[item.product_id] ?? 0;

        return (
          <div
            key={item.product_id}
            className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-start"
          >
            {/* IMAGE SLIDER - Responsive */}
            <div className="w-full lg:w-48 xl:w-56 flex-shrink-0">
              <div className="relative">
                {/* Main Image */}
                <div className="aspect-square bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                  <img
                    src={images[activeIdx] || "https://via.placeholder.com/96"}
                    alt={product?.name}
                    className="max-w-full max-h-full h-auto object-contain"
                    onError={handleImageError}
                  />
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
                    <button
                      onClick={() => changeImage(item.product_id, -1)}
                      className="pointer-events-auto bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => changeImage(item.product_id, 1)}
                      className="pointer-events-auto bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 snap-x">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`thumb ${idx + 1}`}
                        className={`w-12 h-12 sm:w-14 sm:h-14 object-cover rounded cursor-pointer flex-shrink-0 snap-center border-2 transition-all ${activeIdx === idx ? "border-purple-600" : "border-gray-200"
                          }`}
                        onClick={() => changeImage(item.product_id, idx)}
                        onError={handleImageError}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="flex-1 space-y-3 min-w-0">
              <p className="font-medium text-base sm:text-lg pr-2">{product?.name}</p>

              <div className="flex flex-wrap items-center gap-3 text-lg">
                <p className="font-semibold">₹{product?.price * item.quantity}</p>
                {/* {product?.original_price > product?.price && (
                  <>
                    <p className="text-sm text-gray-500 line-through">
                      ₹{product?.original_price * item.quantity}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {Math.round(
                        ((product?.original_price - product?.price) /
                          product?.original_price) *
                        100
                      )}
                      % Off
                    </p>
                  </>
                )} */}
              </div>

              <p className="text-sm text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-2">
                {product.size && <span>Size: {product.size === 'Other' ? product.size_other : product.size}</span>}
                {/* <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-2">
                  Qty:
                  <QuantitySelector
                    productId={item.product_id}
                    initialQty={item.quantity}
                    disabled={isEditing}
                  />
                </span> */}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm w-full lg:w-auto mt-4 lg:mt-0">
              <button
                onClick={() => moveToWishlist(item.product_id)}
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 whitespace-nowrap"
              >
                <Heart className="w-4 h-4" />
                Move to Wishlist
              </button>
              <span className="hidden sm:block text-gray-400">|</span>
              <button
                onClick={() => removeFromCart(item.product_id)}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600 whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        );
      })}

      {/* PRICE SUMMARY */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="space-y-3 text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Product Total</span>
            <span>₹{totalProductPrice}</span>
          </div>
          {/* {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discounts Applied</span>
              <span>- ₹{discount}</span>
            </div>
          )} */}
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">₹{SHIPPING_FEE}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span className="text-green-600">₹{PLATFORM_FEE}</span>
          </div>
          <div className="flex justify-between font-bold text-base sm:text-lg mt-4 pt-4 border-t border-gray-300">
            <span>Final Total</span>
            <span className="text-purple-600">₹{finalTotal}</span>
          </div>
        </div>
      </div>

      {/* CONTINUE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={isEditing}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
}