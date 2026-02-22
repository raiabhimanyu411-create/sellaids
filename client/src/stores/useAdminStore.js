// src/stores/useAdminStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

const ADMIN_TOKEN_KEY = "admin_session_token";

// Same cookie storage as user store
const cookieStorage = {
  getItem: (name) => {
    try {
      const value = Cookies.get(name);
      return value ? value : null;
    } catch (error) {
      console.error("Error reading cookie:", error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      Cookies.set(name, value, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  },
  removeItem: (name) => {
    try {
      Cookies.remove(name);
    } catch (error) {
      console.error("Error removing cookie:", error);
    }
  },
};

export const useAdminStore = create(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      lastActivity: null,

      // -------- LOGIN --------
      login: (adminData, token) => {
        Cookies.set(ADMIN_TOKEN_KEY, token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        set({
          admin: adminData,
          token,
          isAuthenticated: true,
          lastActivity: Date.now(),
        });
      },

      // -------- HYDRATE (reload par token restore) --------
      hydrate: () => {
        const token = Cookies.get(ADMIN_TOKEN_KEY);
        if (token && !get().token) {
          set({ token, isAuthenticated: true });
        }
      },

      // -------- LOGOUT --------
      logout: () => {
        Cookies.remove(ADMIN_TOKEN_KEY);
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
          lastActivity: null,
        });
      },

      // -------- UPDATE ACTIVITY --------
      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },
    }),
    {
      name: "admin-store",
      getStorage: () => cookieStorage,
    }
  )
);