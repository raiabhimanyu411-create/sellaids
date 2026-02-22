import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaShoppingCart, FaFilter, FaTimes } from "react-icons/fa";

import useCartStore from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";
import { useCartActions } from "../../stores/useCartActions";
import CartRightSlider from "../../components/CartRightSlider";

const CategoryPage = () => {
  const { "*": slugPath } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const loaderRef = useRef(null);


  const [isCartSliderOpen, setCartSliderOpen] = useState(false);
  const [sliderProduct, setSliderProduct] = useState(null);


  // Final applied filters (products ko filter karne ke liye)
  const [appliedCondition, setAppliedCondition] = useState([]);
  const [appliedSizes, setAppliedSizes] = useState([]);

  // Temporary selection for mobile/tablet drawer
  const [tempCondition, setTempCondition] = useState([]);
  const [tempSizes, setTempSizes] = useState([]);

  const [sort, setSort] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Detect screen size once on mount + on resize
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const navigate = useNavigate();
  const location = useLocation();

  const { fetchCart } = useCartStore();
  const { isAuthenticated, isUserLoading } = useUserStore();
  const { pendingAdd, setPendingAdd } = useCartActions();

  const handleNavigate = (id) => navigate(`/product-details/${id}`);

  // Handle resize properly
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      isAuthenticated &&
      pendingAdd?.type === "cart" &&
      pendingAdd.product
    ) {
      addToCartDirectly(pendingAdd.product);
      setPendingAdd(null);
    }
  }, [isAuthenticated, pendingAdd]);


  // Fetch Data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/category/product-category?path=${slugPath}`,
          { withCredentials: true }
        );

        if (res.data.success && res.data.data) {
          setData({
            category: res.data.data.category || {},
            subCategories: res.data.data.subCategories || [],
            products: res.data.data.products || [],
            filters: res.data.data.filters || {},
          });
        } else {
          toast.error(res.data.message || "No data found");
        }
      } catch (error) {
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [slugPath]);

  // Cart & Wishlist
  const addToCartDirectly = async (product) => {
    if (!isAuthenticated) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/cart`,
        { product_id: product._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchCart();
        console.log("Adding to cart slider2", res.data.data);
        // navigate("/user/checkout");
        setSliderProduct({
          product_id: res.data.data.product_id,
          user_id: res.data.data.user_id,
        });
        setCartSliderOpen(true);
      } else {
        toast.success(res.data.message);
      }

    } catch (error) {
      if (error.response?.status === 401) {
        setPendingAdd({ product, from: location.pathname, type: "cart" });
        navigate("/UserAuth/UserLogin");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };


  const addToWishlistDirectly = async (product) => {
    if (!isAuthenticated) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/wishlist`,
        { product_id: product._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/user/wishlist");
      } else {
        toast.success(res.data.message);
      }

    } catch (error) {
      if (error.response?.status === 401) {
        setPendingAdd({ product, from: location.pathname, type: "wishlist" });
        navigate("/UserAuth/UserLogin");
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  };


  const handleAddToCart = (product) => {
    if (isUserLoading) return toast.error("Please wait...");
    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname, type: "cart" });
      toast.error("Please log in to add to cart");
      navigate("/UserAuth/UserLogin", {
        state: { from: location.pathname }
      });
      return;
    }
    addToCartDirectly(product);
  };

  const handleWishlist = (product) => {
    if (isUserLoading) return toast.error("Please wait...");

    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname, type: "wishlist" });
      toast.error("Please log in to add to wishlist");
      navigate("/UserAuth/UserLogin");
      return;
    }

    addToWishlistDirectly(product);
  };

  // Apply Filters
  const applyFilters = () => {
    setAppliedCondition(tempCondition);
    setAppliedSizes(tempSizes);
    setIsFilterOpen(false);
  };

  // Clear All Filters
  const clearAllFilters = () => {
    setTempCondition([]);
    setTempSizes([]);
    setAppliedCondition([]);
    setAppliedSizes([]);
    setIsFilterOpen(false);
  };

  // Open drawer with current filters loaded
  const openFilterDrawer = () => {
    setTempCondition([...appliedCondition]);
    setTempSizes([...appliedSizes]);
    setIsFilterOpen(true);
  };

  // Filtering Logic
  const filteredProducts = data?.products?.filter((p) => {
    const conditionMatch =
      appliedCondition.length === 0 ||
      appliedCondition.includes(p.product_condition);

    const sizeValue = p.size === "Other" && p.size_other ? p.size_other : p.size;
    const sizeMatch =
      appliedSizes.length === 0 ||
      appliedSizes.includes(sizeValue);

    return conditionMatch && sizeMatch;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") return a.product_price - b.product_price;
    if (sort === "high") return b.product_price - a.product_price;
    return 0;
  });

  // Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < sortedProducts.length) {
          setVisibleCount((prev) => Math.min(prev + 12, sortedProducts.length));
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [sortedProducts, visibleCount]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-12">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-72 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const availableConditions = ["new", "almost_new", "good", "hardly_ever_used", "satisfactory"];
  const availableSizes = data?.filters?.sizes || [];

  return (
    <>
      {/* Backdrop */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-10 px-8 py-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">

        {/* FILTER SIDEBAR / DRAWER */}
        <aside className={`${isFilterOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed inset-y-0 left-0 w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 z-40 transition-transform duration-300 lg:w-1/4 lg:sticky lg:top-4 lg:self-start lg:h-fit overflow-y-auto`}>
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h3 className="text-2xl font-bold text-gray-800">Filters</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-2xl text-gray-600 hover:text-red-600">
              <FaTimes />
            </button>
          </div>

          <h3 className="hidden lg:block text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Filters
          </h3>

          {/* Condition */}
          <div className="mb-8">
            <p className="font-semibold text-gray-700 mb-3 text-lg">Condition</p>
            <div className="space-y-3 text-base">
              {availableConditions.map((cond) => (
                <label key={cond} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDesktop ? appliedCondition.includes(cond) : tempCondition.includes(cond)}
                    onChange={() => {
                      if (isDesktop) {
                        setAppliedCondition(prev =>
                          prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
                        );
                      } else {
                        setTempCondition(prev =>
                          prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
                        );
                      }
                    }}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="capitalize font-medium text-gray-700">
                    {cond.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          {availableSizes.length > 0 && (
            <div className="mb-8">
              <p className="font-semibold text-gray-700 mb-3 text-lg">Size</p>
              <div className="space-y-3 text-base">
                {availableSizes.map((size) => (
                  <label key={size} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDesktop ? appliedSizes.includes(size) : tempSizes.includes(size)}
                      onChange={() => {
                        if (isDesktop) {
                          setAppliedSizes(prev =>
                            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                          );
                        } else {
                          setTempSizes(prev =>
                            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                          );
                        }
                      }}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Buttons */}
          {!isDesktop && (
            <div className="space-y-4 mt-10">
              <button
                onClick={applyFilters}
                className="w-full bg-orange-500 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow transition"
              >
                Apply Filters
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full border-2 border-red-500 text-red-500 font-bold py-3 rounded-lg hover:bg-red-50 transition"
              >
                Clear All
              </button>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:underline text-blue-600">Home</Link>
            {" / "}
            <Link to="/shop" className="hover:underline text-blue-600">Shop</Link>
            {slugPath?.split("/").map((seg, i, arr) => {
              const path = arr.slice(0, i + 1).join("/");
              return (
                <span key={i}>
                  {" / "}
                  <Link to={`/product-category/${path}`} className="capitalize hover:underline text-blue-600">
                    {seg.replace(/-/g, " ")}
                  </Link>
                </span>
              );
            })}
          </nav>

          {/* Top Bar */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <p className="text-gray-700 text-lg font-semibold">
              Showing {Math.min(visibleCount, sortedProducts.length)} of {sortedProducts.length} products
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Mobile Filter Button */}
              {!isDesktop && (
                <button
                  onClick={openFilterDrawer}
                  className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg font-bold transition shadow"
                >
                  <FaFilter /> Filters
                  {(appliedCondition.length + appliedSizes.length > 0) && (
                    <span className="ml-2 bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                      {appliedCondition.length + appliedSizes.length}
                    </span>
                  )}
                </button>
              )}

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default sorting</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.slice(0, visibleCount).map((product) => {
              let additionalInfo = {};
              try {
                additionalInfo = JSON.parse(product?.product_additionalInfo || "{}");
              } catch (err) { }

              return (
                <div key={product._id} className="group overflow-hidden border-gray-100 transition-all duration-300">
                  <div className="relative h-80 overflow-hidden rounded-t-xl bg-gray-50">
                    <img
                      src={product?.product_img || "/placeholder-image.jpg"}
                      alt={product.product_name}
                      onClick={() => handleNavigate(product._id)}
                      className="object-cover w-full h-full cursor-pointer
                                  transition-transform duration-500 ease-in-out
                                  group-hover:scale-105"
                    />

                    {/* OUT OF STOCK overlay – only on image */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center
                    bg-black/60 pointer-events-none">
                        <span className="text-white text-xl font-bold tracking-widest
                       border-2 border-white px-5 py-2 rounded-lg">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 flex justify-center items-end gap-3 
                  opacity-0 translate-y-5 
                  group-hover:opacity-100 group-hover:translate-y-0 
                  transition-all duration-300 ease-in-out pb-4
                  pointer-events-none">

                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleWishlist(product)}
                        className="bg-black p-3 rounded-md text-white hover:bg-orange-500 transition
                 pointer-events-auto"
                      >
                        <FaHeart className="text-lg" />
                      </button>

                      {/* Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-black p-3 rounded-md text-white hover:bg-orange-500 transition
                 pointer-events-auto"
                      >
                        <FaShoppingCart className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <div className="py-5 ps-1 text-start">
                    <h3
                      onClick={() => handleNavigate(product._id)}
                      className="text-base font-normal text-gray-800 hover:text-blue-700 transition cursor-pointer"
                    >
                      {additionalInfo.title || additionalInfo.description}
                    </h3>
                    <div className="mt-2">
                      <span className="text-base font-thin text-gray-900">
                        ₹{product.product_price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loader */}
          {visibleCount < sortedProducts.length && (
            <div ref={loaderRef} className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          )}
        </main>
      </div>
      <CartRightSlider
        open={isCartSliderOpen}
        product={sliderProduct}
        onClose={() => setCartSliderOpen(false)}
        onRemove={() => {
          setCartSliderOpen(false);
          toast.success("Item removed");
        }}
        onContinue={() => setCartSliderOpen(false)}
      />

    </>
  );
};

export default CategoryPage;