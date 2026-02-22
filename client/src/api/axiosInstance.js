// src/api/axiosInstance.js
import axios from "axios";
import { useUserStore } from "../stores/useUserStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add Bearer token to every request
api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
      window.location.href = "/UserAuth/UserLogin";
    }
    return Promise.reject(error);
  }
);

export default api;