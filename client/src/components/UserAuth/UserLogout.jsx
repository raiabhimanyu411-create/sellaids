import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";

const UserLogout = () => {
  const { logout } = useUserStore();
  const navigate = useNavigate();

  const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000api/user/auth/logout",
        {},
        { withCredentials: true }
      );

      const { success, message } = res.data;
      console.log("Logout API response:", res.data);

      if (success || message === "User not logged in or session expired") {
        logout();
        clearCookies();
        localStorage.removeItem("user-store")
        toast.success("Logged out successfully!");
        console.log("Navigating to login page");
        navigate("/UserAuth/UserLogin"); // Remove { replace: true }
      } else {
        toast.error(message || "Logout failed ❌");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, please try again.");

      logout();
      clearCookies();

      console.log("Navigating to login page after error");
      setTimeout(() => {
        navigate("/UserAuth/UserLogin"); // Remove { replace: true }
      }, 100);
    }
  };

  return (
    <button
      onClick={() => {
        console.log("Logout button clicked");
        handleLogout();
      }}
      className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 w-full"
    >
      Logout
    </button>
  );
};

export default UserLogout;