// src/Layout/VendorDashboardLayout.js
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ChevronDown,
  ChevronRight,
  IndianRupee,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import VendorLogout from "../components/vendor/vendorlogout"; 
export default function VendorDashboardLayout() {
  const [productOpen, setProductOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow fixed top-0 left-0 right-0 z-50">
        <div className="text-lg font-bold text-orange-600">Vendor Panel</div>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col justify-between z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 p-4 border-b">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              V
            </div>
            <h2 className="text-lg font-bold text-gray-800">Vendor Panel</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto md:hidden"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-4 space-y-1">
            <NavLink
              to="/vendor/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-50 ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            {/* Products Dropdown */}
            <div>
              <button
                onClick={() => setProductOpen(!productOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Package size={18} /> Products
                </div>
                {productOpen ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {productOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  <NavLink
                    to="/vendor/all-products"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md hover:bg-orange-50 ${
                        isActive
                          ? "bg-orange-100 text-orange-600 font-medium"
                          : "text-gray-700"
                      }`
                    }
                  >
                    All Products
                  </NavLink>

                  <NavLink
                    to="/vendor/add-product"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md hover:bg-orange-50 ${
                        isActive
                          ? "bg-orange-100 text-orange-600 font-medium"
                          : "text-gray-700"
                      }`
                    }
                  >
                    Add Product
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/vendor/earnings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-50 ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <IndianRupee size={18} /> Earnings
            </NavLink>

            <NavLink
              to="/vendor/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-50 ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <User size={18} /> Profile
            </NavLink>
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="p-4 border-t">
          <VendorLogout /> 
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-20 md:pt-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
