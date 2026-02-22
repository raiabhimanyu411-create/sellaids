// src/components/ProductSearchOverlayModal.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, X, Package } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductSearchOverlayModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  // Auto focus input
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/user/search`, {
          params: { search: query },
          withCredentials: true,
        });
        setResults(res.data.success && Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const getProductDescription = (product) => {
    try {
      // additional_info string hai, parse karo
      const info = JSON.parse(product.additional_info || "{}");
      return info.description || product.model_name || product.product_type || "Unnamed Product";
    } catch (e) {
      // Agar parse nahi hua to fallback
      return product.model_name || product.product_type || "Unnamed Product";
    }
  };

  const getImageSrc = (product) => {
    const photo = product.front_photo;
    const displayText = getProductDescription(product);

    if (photo) {
      return photo.startsWith("http") ? photo : `${API_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
    }

    const words = displayText.split(" ").filter(Boolean);
    let initials = "NA";
    if (words.length >= 2) {
      initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
    } else if (words[0]) {
      initials = words[0].slice(0, 2).toUpperCase();
    }

    return `https://via.placeholder.com/64/F97316/ffffff?text=${initials}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[9999] flex flex-col items-center pt-4 px-4 sm:pt-8 md:pt-12 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Close Button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Search Products</h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
            aria-label="Close search"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 pt-4 pb-5">
          <div className="relative">
            <div className="flex items-center bg-gray-50 border-2 border-gray-300 rounded-2xl px-4 py-4 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-300">
              <Search size={22} className="text-gray-500 mr-3 flex-shrink-0" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search here..."
                className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500 font-medium text-base leading-7"
                style={{ minHeight: "36px" }}
              />

              {loading && (
                <div className="w-5 h-5 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Results Dropdown - FULLY FIXED & RESPONSIVE */}
            {query.trim() && (
              <div
                className="
                  mt-4 
                  max-h-[70vh]           /* Main limit: never exceed 70% of screen */
                  sm:max-h-[65vh]         /* Slightly smaller on larger screens */
                  min-h-0 
                  overflow-y-auto 
                  rounded-2xl 
                  border border-gray-200 
                  bg-white 
                  shadow-lg
                  scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100
                "
              >
                {results.length > 0 ? (
                  results.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition"
                      onClick={() => {
                        window.location.href = `/product-details/${product.id}`;
                        onClose();
                      }}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={getImageSrc(product)}
                          alt={product.model_name || "Product"}
                          className="w-16 h-16 object-cover rounded-xl shadow-sm"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64/F97316/ffffff?text=NA";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate">
                          {getProductDescription(product)}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          SKU: <span className="font-medium">{product.sku || "N/A"}</span>
                        </p>
                        {product.selling_price && (
                          <p className="text-lg font-bold text-orange-600 mt-2">
                            ₹{Number(product.selling_price).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 font-medium text-lg">
                      {loading ? "Searching..." : "No products found"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchOverlayModal;