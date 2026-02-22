// src/pages/dashboard/Cart.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import QuantitySelector from "../../pages/checkout/QuantitySelector";

export default function Cart() {
  const { cart, fetchCart, removeFromCart } = useCartStore();
  const { user, isAuthenticated, isUserLoading } = useUserStore();
  const { addToWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressFields, setAddressFields] = useState({
    address_line: "",
    city: "",
    pincode: "",
  });
  const navigate = useNavigate();
  const [activeImages, setActiveImages] = useState({});

  useEffect(() => {
    if (isUserLoading) return;
    if (!isAuthenticated || !user?.id) {
      navigate("/UserAuth/UserLogin", { state: { from: window.location.pathname } });
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/profile/list`, { withCredentials: true })
      .then((res) => {
        const { data } = res.data;
        if (data.address_line && data.city && data.pincode) {
          const addr = `${data.address_line}, ${data.city}, ${data.pincode}`;
          setShippingAddress(addr);
          setAddressFields({ address_line: data.address_line, city: data.city, pincode: data.pincode });
        }
      })
      .catch(() => setShippingAddress(""))
      .finally(() => {
        fetchCart().then(() => {
          const init = cart.reduce((acc, i) => ({ ...acc, [i.product_id]: 0 }), {});
          setActiveImages(init);
          setLoading(false);
        });
      });
  }, [user, isAuthenticated, isUserLoading, navigate, fetchCart, cart]);

  const handleMoveToWishlist = async (productId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/wishlist`, { product_id: productId }, { withCredentials: true });
      await addToWishlist(productId);
      await removeFromCart(productId);
      toast.success("Moved to wishlist");
      setTimeout(() => navigate("/user/cart"), 1500);
    } catch (err) {
      toast.error("Failed to move");
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    toast.success("Removed from cart");
    setTimeout(() => navigate("/user/cart"), 1500);
  };

  const handleContinue = async () => {
    if (!shippingAddress) return toast.error("Add shipping address");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { cartItems: cart, shippingAddress },
        { withCredentials: true }
      );
      navigate("/user/user-payments", { state: { orderData: res.data.data } });
    } catch (err) {
      toast.error("Failed to proceed");
    }
  };

  const handleSaveAddress = async () => {
    const { address_line, city, pincode } = addressFields;
    const newAddr = `${address_line}, ${city}, ${pincode}`;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/profile/edit`,
        { address_line, city, pincode },
        { withCredentials: true }
      );
      setShippingAddress(newAddr);
      setIsEditingAddress(false);
      toast.success("Address saved");
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const getProductImages = (product) => {
    const more = JSON.parse(product.more_images || "[]") || [];
    return [
      product.front_photo,
      product.back_photo,
      product.label_photo,
      product.inside_photo,
      product.button_photo,
      product.wearing_photo,
      ...more,
    ].filter(Boolean);
  };

  const changeImage = (productId, offset) => {
    setActiveImages((prev) => {
      const cur = prev[productId] || 0;
      const imgs = getProductImages(cart.find((i) => i.product_id === productId)?.product || {});
      const len = imgs.length;
      const newIdx = (cur + offset + len) % len;
      return { ...prev, [productId]: newIdx };
    });
  };

  if (isUserLoading || loading) return <p className="text-center mt-10">Loading...</p>;
  if (!isAuthenticated) return <p className="text-center mt-10">Please log in.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-center">My Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-xl">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => {
              const images = getProductImages(item.product);
              const activeIdx = activeImages[item.product_id] || 0;
              const activeImagePath = images[activeIdx];

              return (
                <div key={item.product_id} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition">
                  <div className="relative mb-4">
                    <img
                     src={
                        activeImagePath 
                          ? `${import.meta.env.VITE_API_URL}/${activeImagePath}`
                          : "https://placehold.co/150x150"
                      }
                      alt={item.product.name}
                      className="w-full h-48 object-contain rounded-md"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => changeImage(item.product_id, -1)}
                          className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => changeImage(item.product_id, 1)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>

                  <p className="font-semibold text-lg">{item.product.name}</p>
                  <p className="text-gray-700">₹{item.product.price}</p>

                  {/* QUANTITY SELECTOR */}
                  <div className="flex items-center mt-3">
                    <span className="text-gray-600 mr-2">Qty:</span>
                    <QuantitySelector productId={item.product_id} initialQty={item.quantity} />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-md text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleMoveToWishlist(item.product_id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md text-sm hover:bg-green-700"
                    >
                      Move to Wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADDRESS & CONTINUE */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow">
            <div className="mb-4">
              <label className="block font-semibold mb-2">Shipping Address</label>
              {isEditingAddress ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input
                      name="address_line"
                      value={addressFields.address_line}
                      onChange={(e) => setAddressFields({ ...addressFields, [e.target.name]: e.target.value })}
                      className="border p-2 rounded"
                      placeholder="Address"
                    />
                    <input
                      name="city"
                      value={addressFields.city}
                      onChange={(e) => setAddressFields({ ...addressFields, [e.target.name]: e.target.value })}
                      className="border p-2 rounded"
                      placeholder="City"
                    />
                    <input
                      name="pincode"
                      value={addressFields.pincode}
                      onChange={(e) => setAddressFields({ ...addressFields, [e.target.name]: e.target.value })}
                      className="border p-2 rounded"
                      placeholder="Pincode"
                    />
                  </div>
                  <button onClick={handleSaveAddress} className="bg-green-600 text-white px-4 py-1 rounded">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="p-2 bg-gray-100 rounded">{shippingAddress || "No address"}</p>
                  <button onClick={() => setIsEditingAddress(true)} className="text-blue-600 text-sm mt-1">
                    {shippingAddress ? "Edit" : "Add"} Address
                  </button>
                </>
              )}
            </div>
            <div className="text-right">
              <button onClick={handleContinue} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700">
                Continue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 