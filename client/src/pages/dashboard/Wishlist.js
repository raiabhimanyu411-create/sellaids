import React, { useEffect, useState } from "react";
import useWishlistStore from "../../stores/useWishlistStore";
import useCartStore from "../../stores/useCartStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster
import UserFooter from "../../components/UserFooter";

export default function Wishlist() {
  const { wishlist, setWishlist, removeFromWishlist } = useWishlistStore();
  const { user, isAuthenticated, isUserLoading } = useUserStore();
  const { fetchCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State to manage the active image index for each product
  const [activeImages, setActiveImages] = useState({});

  const handleAddToWishlist = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/wishlist`,
        { product_id: productId },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Item added to wishlist! ✅");
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/user/wishlist`, {
          withCredentials: true,
        })
        .then((res) => setWishlist(res.data.data || []));
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      toast.error(err.response?.data?.message || "Failed to add to wishlist ❌");
    }
  };

  useEffect(() => {
    if (isUserLoading) return;
    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to view your wishlist ❌");
      setTimeout(() => {
        navigate("/UserAuth/UserLogin", {
          state: { from: window.location.pathname },
        });
      }, 1500); // Delay navigation
    } else {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/user/wishlist`, {
          withCredentials: true,
        })
        .then((res) => {
          setWishlist(res.data.data || []);
          // Initialize active image index for each product
          const initialActiveImages = res.data.data.reduce((acc, item) => {
            acc[item.product_id] = 0;
            return acc;
          }, {});
          setActiveImages(initialActiveImages);
        })
        .catch((err) => {
          console.error("Failed to fetch wishlist:", {
            status: err.response?.status,
            message: err.response?.data?.message || err.message,
            url: err.config?.url,
          });
          if (err.response?.status === 401) {
            toast.error("Session expired. Please log in again ❌");
            setTimeout(() => {
              navigate("/UserAuth/UserLogin", {
                state: { from: window.location.pathname },
              });
            }, 1500); // Delay navigation
          } else if (err.response?.status === 404) {
            toast.error("Wishlist endpoint not found. Please check the API URL ❌");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, isAuthenticated, isUserLoading, navigate, setWishlist]);

  const handleRemove = async (productId) => {
    try {
      const updatedWishlist = wishlist.filter(
        (item) => item.product_id !== productId
      );
      setWishlist(updatedWishlist);

      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/wishlist/${productId}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "Item removed from wishlist! ✅");
    } catch (err) {
      console.error("Failed to remove item:", err);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/user/wishlist`, {
          withCredentials: true,
        })
        .then((res) => setWishlist(res.data.data || []));
      toast.error(err.response?.data?.message || "Failed to remove item ❌");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/cart`,
        { product_id: productId },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Item added to cart! ✅");
      await fetchCart();
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error(err.response?.data?.message || "Failed to add item to cart ❌");
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/96"; // Fallback image
  };

  // Function to get all product images
  const getProductImages = (product) => {
    if (!product || typeof product !== "object") return [];

    const moreImages = (() => {
      try {
        return JSON.parse(product.more_images || "[]") || [];
      } catch {
        return [];
      }
    })();

    const images = [
      product.front_photo,
      product.back_photo,
      product.label_photo,
      product.inside_photo,
      product.button_photo,
      product.wearing_photo,
      ...moreImages,
    ].filter(Boolean);

    return images;
  };

  // Function to change active image
  const changeImage = (productId, offset) => {
    setActiveImages((prev) => {
      const currentIndex = prev[productId] || 0;
      const images = getProductImages(
        wishlist.find((item) => item.product_id === productId)?.product || {}
      );
      const newIndex = (currentIndex + offset + images.length) % images.length;
      return { ...prev, [productId]: newIndex };
    });
  };

  if (isUserLoading)
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        {/* <Toaster /> */}
        {/* Add Toaster component */}
        <p className="text-center mt-10">Loading user...</p>
      </div>
    );
  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 p-6">
       {/* <Toaster /> */}
       {/* Add Toaster component */}
        <p className="text-center mt-10">Loading wishlist...</p>
      </div>
    );
  if (!isAuthenticated || !user?.id) return null;

  return (
      <div>
    <div className="min-h-screen bg-gray-100 p-6">
      {/* <Toaster /> */}
      {/* Add Toaster component */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        My Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="text-xl font-semibold">
            No products added to your wishlist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const images = getProductImages(item.product);
            const activeIndex = activeImages[item.product_id] || 0;
            const activeImagePath = images[activeIndex];

            return (
              <div
                key={item.product_id}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="mb-4 text-center sm:text-left w-full">
                  {/* Product Image Slider */}
                  <div className="relative">
                    {/* Main Centered Image */}
                     <div className="flex justify-center mb-2 min-h-[192px]">
                      <img
                        src={
                          activeImagePath
                            ? `${import.meta.env.VITE_API_URL}/${activeImagePath}`
                            : "https://via.placeholder.com/96"
                        }
                        alt={item.product?.name || "Product Image"}
                        className="max-w-full h-auto max-h-48 object-contain rounded-md"
                        onError={handleImageError}
                      />
                    </div>
                    {/* Navigation Arrows */}
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => changeImage(item.product_id, -1)}
                        className="text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                        disabled={images.length <= 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => changeImage(item.product_id, 1)}
                        className="text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                        disabled={images.length <= 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                    {/* Thumbnail Strip - Now with full URL */}
                    <div className="flex overflow-x-auto space-x-2 mt-2 justify-center">
                      {images.map((img, index) => (
                        <img
                          key={index}
                          src={`${import.meta.env.VITE_API_URL}/${img}`}
                          alt={`${item.product?.name} Thumbnail ${index + 1}`}
                          className={`max-w-12 h-auto max-h-12 object-contain rounded-md cursor-pointer ${
                            activeIndex === index
                              ? "border-2 border-blue-600"
                              : ""
                          }`}
                          onClick={() =>
                            changeImage(item.product_id, index - activeIndex)
                          }
                          onError={handleImageError}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Product Details */}
                  <p className="font-semibold text-lg text-gray-900 mt-4">
                    {item.product?.name || "Unknown Product"}
                  </p>
                  <p className="text-gray-700">
                    ₹{item.product?.price || "N/A"}
                  </p>
                  {/* <p className="text-gray-600">
                    Added by: {item.user?.name || "Unknown User"}
                  </p> */}
                </div>
                {/* Buttons in a single line at the bottom */}
                <div className="w-full flex justify-between mt-4">
                  <button
                    onClick={() => handleAddToCart(item.product_id)}
                    className="flex items-center justify-center bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-1/2 mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="flex items-center justify-center bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-1/2 ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    {/* ✅ UserFooter added */}
      <div className="mt-8">
        <UserFooter />
      </div>
      </div>
  );
}