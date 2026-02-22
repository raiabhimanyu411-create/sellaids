import axios from "axios";
import { useAdminStore } from "../../stores/useAdminStore"; // आपका zustand store
import toast from "react-hot-toast";

// Global Axios Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminStore.getState().logout();
      toast.error("Session expired. Please login again.");
      // Optional: redirect to login page
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default axios;
