import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

// ✅ Custom adapter so Zustand understands Cookies as a storage
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
      Cookies.set(name, value, { expires: 7 }); // store for 7 days
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

// ✅ Zustand store definition
export const useVendorStore = create(
  persist(
    (set, get) => ({
      vendor: null,              // Vendor info object
      token: null,               // Auth token
      isAuthenticated: false,    // Boolean to check login
      lastActivity: null,        // For activity tracking

      // ✅ Login or set vendor data
      setVendorData: (vendor, token) => {
        Cookies.set("session_cookie_name", token, { expires: 7 });
        set({
          vendor,
          token,
          isAuthenticated: true,
          lastActivity: Date.now(),
        });
      },

      // ✅ Login shortcut (same effect as above)
      login: (vendorData, token) => {
        Cookies.set("session_cookie_name", token, { expires: 7 });
        set({
          vendor: vendorData,
          token,
          isAuthenticated: true,
          lastActivity: Date.now(),
        });
      },

      // ✅ Logout (clear both Zustand & cookies)
      logout: () => {
        Cookies.remove("session_cookie_name");
        set({
          vendor: null,
          token: null,
          isAuthenticated: false,
          lastActivity: null,
        });
      },

      // ✅ Update activity timestamp
      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },
    }),
    {
      name: "vendor-store",
      getStorage: () => cookieStorage, // ✅ custom cookie adapter
    }
  )
);
