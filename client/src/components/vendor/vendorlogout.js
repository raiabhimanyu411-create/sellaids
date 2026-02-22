import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useVendorStore } from "../../stores/useVendorStore";

const VendorLogout = () => {
  const { logout } = useVendorStore();
  const navigate = useNavigate();

  const clearCookies = () => {
    // 🔹 Clear all cookies by expiring them
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
  };
// const handleLogout = async () => {
//     try {
//       // Backend logout API call
//       const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/auth/logout`, {},{ withCredentials: true });

//       const { success, message } = res.data

//       console.log(res.data)

//       if (success) {
//         console.log(success)
//         logout()
//         localStorage.removeItem("admin-store")
//         toast.success(message);
//         // navigate("/admin-login", { replace: true });
//         window.location.replace("/admin-login");
//       }
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast.error("Logout failed, redirecting to login");
//     }
//   };
  const handleLogout = async () => {
    try {
      // 🔹 Call backend logout API
      const res = await axios.post(
        "http://localhost:5000api/vendor/auth/logout",
        {},
        { withCredentials: true }
      );
const { success, message } = res.data

      console.log(res.data)

      if (success) {
        console.log(success)
        logout()
        localStorage.removeItem("vendor-store")
        toast.success("Logged out successfully!");
        // navigate("/admin-login", { replace: true });
        window.location.replace("/vendor/login");
      }
      // 🔹 Clear Zustand store
      // logout();

      // // 🔹 Clear localStorage and cookies
      // localStorage.clear();
      // sessionStorage.clear();
      // clearCookies();

      // toast.success("Logged out successfully!");
      navigate("/vendor/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, redirecting to login");

      // Even if API fails — force clear everything
      logout();
      localStorage.clear();
      sessionStorage.clear();
      clearCookies();

      navigate("/vendor/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 w-full"
    >
      Logout
    </button>
  );
};

export default VendorLogout;
