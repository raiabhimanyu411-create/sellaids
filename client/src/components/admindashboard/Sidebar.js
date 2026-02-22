import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyCheckAlt,
  FaUserCircle,
  FaCommentDots, 
  FaChartBar
} from "react-icons/fa";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
  { label: "Users Management", path: "/admin/users", icon: <FaUsers /> },
  { label: "Vendors Management", path: "/admin/vendors", icon: <FaStore /> },
  { label: "Products Management", path: "/admin/products", icon: <FaBoxOpen /> },
  { label: "Orders Management", path: "/admin/orders", icon: <FaShoppingCart /> },
  { label: "Payments", path: "/admin/payments", icon: <FaMoneyCheckAlt /> },
//   { label: "Reviews", path: "/admin/reviews", icon: <FaCommentDots  /> },
  { label: "Payment & Commission", path: "/admin/commission", icon: <FaChartBar /> },
  // { label: "Reports & Analytics", path: "/admin/reports", icon: <FaChartBar /> },
];

const Sidebar = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin-store"));
    if (storedAdmin) setAdmin(storedAdmin?.state);
  }, []);

  // console.log(admin)

  return (
    <aside className="w-64 h-screen bg-black text-gray-300 flex flex-col justify-between fixed left-0 top-0 shadow-lg">
      {/* Top Section - Logo */}
      <div>
        <div className="p-6 text-center border-b border-gray-700">
          {/* Use public folder path directly */}
          <img src="/site.png" alt="Logo" className="mx-auto w-32 h-auto" />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.label}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                  isActive
                    ? "bg-[#FF6A00] text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-[#FF6A00]"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section - Admin Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF6A00] rounded-full p-2 text-white">
            <FaUserCircle size={24} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {admin?.admin?.name || "Admin User"}
            </div>
            <div className="text-xs text-gray-400">
              {admin?.admin?.email || "admin@example.com"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
