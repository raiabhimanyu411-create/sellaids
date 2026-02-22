import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaShoppingCart, FaFilter, FaTimes } from "react-icons/fa";
import useCartStore from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";
import { useCartActions } from "../../stores/useCartActions";
import CartRightSlider from "../../components/CartRightSlider";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const loaderRef = useRef(null);

  // FINAL applied filters
  const [appliedCondition, setAppliedCondition] = useState([]);
  const [appliedSizes, setAppliedSizes] = useState([]);

  // TEMP (mobile drawer)
  const [tempCondition, setTempCondition] = useState([]);
  const [tempSizes, setTempSizes] = useState([]);

  // Filters from API
  const [availableConditions, setAvailableConditions] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const [isCartSliderOpen, setCartSliderOpen] = useState(false);
  const [sliderProduct, setSliderProduct] = useState(null);

  // SORT
  const [sort, setSort] = useState("default");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const navigate = useNavigate();
  const location = useLocation();

const { fetchCart } = useCartStore();
  const { isAuthenticated, isUserLoading } = useUserStore();
  const { pendingAdd, setPendingAdd } = useCartActions();

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleNavigate = (id) => navigate(`/product-details/${id}`);

  // Resize detect
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
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

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/product/shop/all-products`);

        console.log(res.data)
        if (
          res.data.success &&
          res.data.products &&
          Array.isArray(res.data.products.products)
        ) {
          setProducts(res.data.products.products);
          setAvailableConditions(res.data.products.filters?.product_conditions || []);
          setAvailableSizes(res.data.products.filters?.sizes || []);
        } else {
          toast.error("No products found");
        }
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE]);

  // CART
  const addToCartDirectly = async (product) => {
    try {
      // const productId = getProductId(product);

      const res = await axios.post(
        `${API_BASE}/api/user/cart`,
        { product_id: product._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchCart()
        setSliderProduct({
          product_id: res.data.data.product_id,
          user_id: res.data.data.user_id,
        });

        setCartSliderOpen(true);
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToCart = (product) => {
    if (isUserLoading) return toast.error("Please wait...");

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

  // WISHLIST
  const addToWishlistDirectly = async (product) => {
    try {
      // const productId = getProductId(product);

      const res = await axios.post(
        `${API_BASE}/api/user/wishlist`,
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

  // APPLY / CLEAR FILTERS
  const applyFilters = () => {
    setAppliedCondition(tempCondition);
    setAppliedSizes(tempSizes);
    setIsFilterOpen(false);
  };

  const clearAllFilters = () => {
    setTempCondition([]);
    setTempSizes([]);
    setAppliedCondition([]);
    setAppliedSizes([]);
    setIsFilterOpen(false);
  };

  const openFilterDrawer = () => {
    setTempCondition([...appliedCondition]);
    setTempSizes([...appliedSizes]);
    setIsFilterOpen(true);
  };

  // FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    const conditionMatch =
      appliedCondition.length === 0 ||
      appliedCondition.includes(p.product_condition);

    const sizeValue =
      p.size === "Other" && p.size_other ? p.size_other : p.size;

    const sizeMatch =
      appliedSizes.length === 0 ||
      appliedSizes.some((s) =>
        sizeValue?.toString().split(",").map((x) => x.trim()).includes(s)
      );

    return conditionMatch && sizeMatch;
  });

  // SORT LOGIC (PRICE)
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
          <div key={i} className="animate-pulse bg-white rounded-lg shadow-md">
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

  return (
    <>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-10 px-8 py-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        {/* FILTER SIDEBAR */}
        <aside
          className={`${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed inset-y-0 left-0 w-80 bg-white p-6 rounded-2xl shadow-lg border z-40 transition-transform duration-300 lg:w-1/4 lg:sticky lg:top-4 lg:h-fit overflow-y-auto`}
        >
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h3 className="text-2xl font-bold">Filters</h3>
            <button onClick={() => setIsFilterOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* CONDITION */}
          <div className="mb-8">
            <p className="font-semibold mb-3">Condition</p>
            {availableConditions.map((cond) => (
              <label key={cond} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={
                    isDesktop
                      ? appliedCondition.includes(cond)
                      : tempCondition.includes(cond)
                  }
                  onChange={() => {
                    const setter = isDesktop ? setAppliedCondition : setTempCondition;
                    setter((prev) =>
                      prev.includes(cond)
                        ? prev.filter((c) => c !== cond)
                        : [...prev, cond]
                    );
                  }}
                />
                <span className="capitalize">{cond.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>

          {/* SIZE */}
          {availableSizes.length > 0 && (
            <div className="mb-8">
              <p className="font-semibold mb-3">Size</p>
              {availableSizes.map((size) => (
                <label key={size} className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={
                      isDesktop
                        ? appliedSizes.includes(size)
                        : tempSizes.includes(size)
                    }
                    onChange={() => {
                      const setter = isDesktop ? setAppliedSizes : setTempSizes;
                      setter((prev) =>
                        prev.includes(size)
                          ? prev.filter((s) => s !== size)
                          : [...prev, size]
                      );
                    }}
                  />
                  {size}
                </label>
              ))}
            </div>
          )}

          {!isDesktop && (
            <div className="space-y-4">
              <button
                onClick={applyFilters}
                className="w-full bg-orange-500 text-white py-3 rounded-lg"
              >
                Apply Filters
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full border border-red-500 text-red-500 py-3 rounded-lg"
              >
                Clear All
              </button>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <nav className="text-sm mb-6">
            <Link to="/" className="text-blue-600">Home</Link> / <span>Shop</span>
          </nav>

          {/* TOP BAR */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <p>
              Showing {Math.min(visibleCount, sortedProducts.length)} of{" "}
              {sortedProducts.length} products
            </p>

            <div className="flex items-center gap-4">
              {!isDesktop && (
                <button
                  onClick={openFilterDrawer}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaFilter /> Filters
                </button>
              )}

              {/* PRICE SORT */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="default">Default sorting</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.slice(0, visibleCount).map((product) => {
              let additionalInfo = {};
              try {
                additionalInfo = JSON.parse(product?.product_additionalInfo || "{}");
              } catch { }

              return (
                <div key={product._id} className="group overflow-hidden transition-all duration-300">
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

                    {/* HOVER ICONS */}
                    <div className="absolute inset-0 flex justify-center items-end gap-3 
                      opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 
                      transition-all duration-300 pb-4 pointer-events-none">
                      <button
                        onClick={() => handleWishlist(product)}
                        className="bg-black p-3 rounded-md text-white hover:bg-orange-500 pointer-events-auto"
                      >
                        <FaHeart />
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-black p-3 rounded-md text-white hover:bg-orange-500 pointer-events-auto"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>

                  <div className="py-5 ps-1">
                    <h3
                      onClick={() => handleNavigate(product._id)}
                      className="cursor-pointer hover:text-blue-700"
                    >
                      {additionalInfo.title || additionalInfo.description}
                    </h3>
                    <p className="mt-2">₹{product.product_price}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleCount < sortedProducts.length && (
            <div ref={loaderRef} className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
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

export default Shop;