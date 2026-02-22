import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa"; // FaBell removed
import { useLocation, useNavigate } from "react-router-dom";
import LogoutAdmin from "./Logout";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin-store"));
    if (storedAdmin) setAdmin(storedAdmin?.state);
  }, []);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-40" ref={dropdownRef}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 lg:hidden">
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">
        {/* 👤 User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <FaUserCircle size={32} className="text-blue-600" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-2 z-50">
              <div className="px-4 py-2 border-b">
                <div className="text-sm font-medium text-gray-800">
                  {admin?.admin?.name || "Admin User"}
                </div>
                <div className="text-xs text-gray-500">
                  {admin?.admin?.email || "admin@example.com"}
                </div>
              </div>

              <button
                onClick={() => { if (location.pathname !== "/admin/profile-settings") navigate("/admin/profile-settings"); setIsOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </button>

              {/* Logout using separate component */}
              <LogoutAdmin />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
