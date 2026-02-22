// src/stores/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

const TOKEN_KEY = "user_session_token";

// Custom cookie storage for Zustand persist
const cookieStorage = {
  getItem: (name) => Cookies.get(name) || null,
  setItem: (name, value) => Cookies.set(name, value, { expires: 7, secure: true, sameSite: "strict" }),
  removeItem: (name) => Cookies.remove(name),
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      lastActivity: null,

      // 🔥 LOGIN
      login: (userData, token) => {
        Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: "strict" });
        set({
          user: userData,
          token,
          isAuthenticated: true,
          lastActivity: Date.now(),
        });
      },

      // 🔥 RESTORE SESSION FROM COOKIE
      hydrate: () => {
        const token = Cookies.get(TOKEN_KEY);
        if (token && !get().token) {
          set({ token, isAuthenticated: true });
        }
      },

      // 🔥 LOGOUT (FULL FIX)
      logout: () => {
        // Remove token cookie
        Cookies.remove(TOKEN_KEY);

        // Reset Zustand store
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          lastActivity: null,
        });

        // Clear persisted storage (most important fix!)
        cookieStorage.removeItem("user-store");
      },

      // Track activity
      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },
    }),
    {
      name: "user-store",
      getStorage: () => cookieStorage,
    }
  )
);
