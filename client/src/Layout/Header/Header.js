// Header.jsx

import React, { useState, useEffect } from "react";
import { MegaMenu, MensMegaMenu, KidsMegaMenu, MobileMenuDrawer } from "./MegaMenu";
import { User, Heart, Search, ShoppingCart, Menu, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import useCartStore from "../../stores/useCartStore";
import axios from "axios";
import toast from "react-hot-toast";
import SearchOverlay from '../../components/SearchOverlay';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUserStore();
  const { cart, fetchCart } = useCartStore();
  const cartCount = cart?.length || 0;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [womenCategories, setWomenCategories] = useState({});
  const [menCategories, setMenCategories] = useState({});
  const [kidsCategories, setKidsCategories] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showEmptyCart, setShowEmptyCart] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/category`, { withCredentials: true });
        console.log(res.data);
        if (res.data.success && Array.isArray(res.data.data)) {
          const data = res.data.data;
          const women = data.find(c => c.slug === "women") || {};
          const men = data.find(c => c.slug === "men") || {};
          const kids = data.find(c => c.slug === "kids") || {};
          console.log(women)

          setWomenCategories(women);
          setMenCategories(men);
          setKidsCategories(kids);

          // Global variable for drawer access
          window.__CATEGORIES__ = { women, men, kids };
        }
      } catch (err) {
        console.log("Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const handleCartClick = () => {
    if (cartCount === 0) setShowEmptyCart(true);
    else navigate("/user/checkout");
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">

          {/* Logo */}
          <Link to="/landingpage">
            <img src="/logo.webp" alt="Logo" className="h-[80px] sm:h-[100px] w-auto" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-10 xl:space-x-12 text-sm font-medium">
            <div className="relative group">
              <Link
                to={`/product-category/${womenCategories?.slug}`}
                className="flex items-center gap-1 cursor-pointer hover:text-orange-500 text-base text-gray-700 font-medium">
                {womenCategories?.name}
                <ChevronDown size={16} />
              </Link>
              <MegaMenu womenCategories={womenCategories} />
            </div>
            <div className="relative group">
              <Link
                to={`/product-category/${menCategories?.slug}`}
                className="flex items-center gap-1 cursor-pointer hover:text-orange-500 text-base text-gray-700 font-medium">
                {menCategories?.name}
                <ChevronDown size={16} />
              </Link>
              <MensMegaMenu menCategories={menCategories} />
            </div>
            <div className="relative group">
              <Link
                to={`/product-category/${kidsCategories?.slug}`}
                className="flex items-center gap-1 cursor-pointer hover:text-orange-500 text-base text-gray-700 font-medium">
                {kidsCategories?.name}
                <ChevronDown size={16} />
              </Link>
              <KidsMegaMenu kidsCategories={kidsCategories} />
            </div>
            <Link to="/sellwithus" className="hover:text-orange-500 text-base text-gray-700 font-medium">
              SELL WITH US
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-6">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-orange-500">
                  <User size={20} />
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                  <ChevronDown size={16} className="hidden md:block" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => navigate("/user")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => navigate("/user/orders")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => navigate("/user/wishlist")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      Wishlist
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        logout();
                        toast.success("Logged out successfully");
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/UserAuth/UserLogin" className="flex items-center gap-1 hover:text-orange-500">
                <User size={20} />
                <span className="hidden md:block text-sm font-medium">Login</span>
              </Link>
            )}
            <button onClick={() => user ? navigate("/user/wishlist") : navigate("/UserAuth/UserLogin")} className="hover:text-orange-500">
              <Heart size={20} />
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-orange-500"><Search size={20} /></button>
            <button onClick={handleCartClick} className="relative hover:text-orange-500">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            {/* Mobile Hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} className="text-orange-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer – Tera Dream Wala */}
      <MobileMenuDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Empty Cart & Search Modals */}
       {showEmptyCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center animate-fade-in">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty!</h3>
            <p className="text-sm text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowEmptyCart(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowEmptyCart(false);
                  navigate("/shop");
                }}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;