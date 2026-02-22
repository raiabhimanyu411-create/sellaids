// src/pages/Bestsellers.jsx
import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import useCartStore from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartActions } from "../stores/useCartActions";
import { toast } from "react-hot-toast";
import CartRightSlider from "./CartRightSlider";
import { useMediaQuery } from "react-responsive";

const PLACEHOLDER_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";

// Yeh function daal diya — ab kabhi JSON.parse crash nahi karega
const safeJsonParse = (data, fallback = {}) => {
  if (!data) return fallback;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn("Invalid JSON in product.info:", data);
    return fallback;
  }
};

function Bestsellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartPopup, setCartPopup] = useState(null);
  const [isCartSliderOpen, setCartSliderOpen] = useState(false);
  const [sliderProduct, setSliderProduct] = useState(null);
  const isMobile475 = useMediaQuery({ maxWidth: 475 });

  const navigate = useNavigate();
  const location = useLocation();

  const { fetchCart } = useCartStore();
  const { isAuthenticated, isUserLoading } = useUserStore();
  const { pendingAdd, setPendingAdd } = useCartActions();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/management/dashboard`
        );
        const topProducts = res.data?.data?.top_products || [];
        console.log(res.data)
        setProducts(topProducts);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
        toast.error("Failed to load bestsellers");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Baki sab same (login, cart, wishlist) — kuch nahi badla

  useEffect(() => {
    if (isUserLoading) return;

    const addToCartId = location.state?.addToCart;
    const addToWishlistId = location.state?.addToWishlist;

    if (addToCartId && isAuthenticated && products.length > 0) {
      const product = products.find((p) => p.id === addToCartId);
      if (product) {
        addToCartDirectly(product);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }

    if (addToWishlistId && isAuthenticated && products.length > 0) {
      const product = products.find((p) => p.id === addToWishlistId);
      if (product) {
        addToWishlistDirectly(product);
        navigate("/user/wishlist");
      }
    }
  }, [isAuthenticated, isUserLoading, products, location, navigate]);

  useEffect(() => {
    if (
      isAuthenticated &&
      pendingAdd?.type === "cart" &&
      pendingAdd?.from === location.pathname &&
      pendingAdd?.product?.id
    ) {
      (async () => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/cart`,
            { product_id: pendingAdd.product.id },
            { withCredentials: true }
          );

          if (res.data.success) {
            toast.success(res.data.message);

            setSliderProduct({
              product_id: res.data.data.product_id,
              user_id: res.data.data.user_id,
            });

            setCartSliderOpen(true);
          }
        } catch (err) {
          toast.error("Failed to add to cart");
        }
      })();
    }
  }, [isAuthenticated]);

  const addToCartDirectly = async (product) => {
    if (isUserLoading || !isAuthenticated) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/cart`,
        { product_id: product.id },
        { withCredentials: true }
      );

      await fetchCart();

      if (response.data.success) {
        toast.success(response.data.message);
        setSliderProduct({
          product_id: response.data.data.product_id,
          user_id: response.data.data.user_id,
        });

        setCartSliderOpen(true)
      } else {
        toast.success(response.data.message);
      }

    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to cart";
      toast.error(msg);

      if (error.response?.status === 401) {
        setPendingAdd({ product, from: location.pathname, type: "cart" });
        navigate("/UserAuth/UserLogin", {
          state: { from: location.pathname, addToCart: product.id },
        });
      }
    }
  };


  const handleAddToCart = (product) => {
    if (isUserLoading) {
      toast.error("Please wait...");
      return;
    }
    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname, type: "cart" });
      toast.error("Please log in to add to cart");
      navigate("/UserAuth/UserLogin", {
        state: { from: location.pathname },
      });
      return;
    }
    addToCartDirectly(product);
  };

  const addToWishlistDirectly = async (product) => {
    if (isUserLoading || !isAuthenticated) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/wishlist`,
        { product_id: product.id },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/user/wishlist");
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to wishlist";
      toast.error(msg);
      if (error.response?.status === 401) {
        setPendingAdd({ product, from: location.pathname, type: "wishlist" });
        navigate("/UserAuth/UserLogin", {
          state: { from: location.pathname, addToWishlist: product.id },
        });
      }
    }
  };

  const handleWishlist = (product) => {
    if (isUserLoading) {
      toast.error("Please wait...");
      return;
    }
    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname, type: "wishlist" });
      toast.error("Please log in to add to wishlist");
      navigate("/UserAuth/UserLogin", {
        state: { from: location.pathname, addToWishlist: product.id },
      });
      return;
    }
    addToWishlistDirectly(product);
  };

  useEffect(() => {
    if (cartPopup) {
      const timer = setTimeout(() => setCartPopup(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [cartPopup]);

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-orange-50 border border-gray-200"
    >
      <ChevronLeft size={24} className="text-gray-700" />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-orange-50 border border-gray-200"
    >
      <ChevronRight size={24} className="text-gray-700" />
    </button>
  );

  const settings = {
    dots: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-lg">
        No bestseller products available.
      </div>
    );
  }

  // YEH FIX KIYA — ab kabhi crash nahi hoga!
  const ProductCard = ({ product }) => {
    const info = safeJsonParse(product.info, { description: product.name || "Product" });

    return (
      <div className="px-3">
        <div className="group relative bg-white overflow-hidden transition-all duration-300 border border-gray-100 ">
          <div className="relative overflow-hidden bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/product-details/${product.id}`)}>
            <img
              src={
                product.img && product.img !== "null" && product.img.trim()
                  ? product.img
                  : PLACEHOLDER_DATA_URL
              }
              alt={info.description || "Product"}
              className={`w-full h-80 object-cover transition-transform duration-700
      ${product.stock === 0
                  ? "grayscale cursor-not-allowed"
                  : "group-hover:scale-105"
                }`}
              onError={(e) => (e.target.src = PLACEHOLDER_DATA_URL)}
            />

            {/* OUT OF STOCK overlay – SAME as other cards */}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center
                    bg-black/60 rounded-t-xl">
                <span className="text-white text-xl font-bold tracking-widest
                       border-2 border-white px-5 py-2 rounded-lg">
                  OUT OF STOCK
                </span>
              </div>
            )}

            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg p-3 flex flex-col gap-3 shadow-xl opacity-0 group-hover:opacity-100 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out z-10">
              <button onClick={(e) => { e.stopPropagation(); handleWishlist(product); }} className="text-gray-600 hover:text-red-500 transition">
                <Heart size={20} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="text-gray-600 hover:text-green-600 transition">
                <ShoppingCart size={20} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); navigate(`/product-details/${product.id}`); }} className="text-gray-600 hover:text-orange-600 transition">
                <Eye size={20} />
              </button>
            </div>
          </div>

          <div className="p-4 text-start bg-white">
            <h3
              className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-orange-600 transition cursor-pointer"
              onClick={() => navigate(`/product-details/${product.id}`)}
            >
              {info.title || info.description}
            </h3>

            <p className="text-lg font-bold text-black mt-2">
              ₹{parseFloat(product.price || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-[-60px]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading text-black leading-tight text-center mt-0 mb-6 md:mb-12">
            Bestseller
          </h2>

          {/* {products.length <= 4 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="relative">
              <Slider {...settings}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Slider>
            </div>
          )} */}
          {/* MOBILE (≤475px): Always Y-axis list */}
          {isMobile475 ? (
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : products.length <= 4 ? (
            /* DESKTOP/TABLET – Normal Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* DESKTOP/TABLET – Slider */
            <div className="relative">
              <Slider {...settings}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Slider>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}</style>

      <CartRightSlider
        open={isCartSliderOpen}
        product={sliderProduct}
        onClose={() => setCartSliderOpen(false)}
      />
    </>
  );
}

export default Bestsellers;