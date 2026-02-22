import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null, // logged-in user info
  wishlist: [], // user's wishlist

  // Set user after login
  setUser: (userData) => set({ user: userData }),

  // Logout function
  logout: () => set({ user: null, wishlist: [] }),

  // Set wishlist from backend
  setWishlist: (items) => set({ wishlist: items }),

  // Add an item to wishlist
  addToWishlist: (item) =>
    set((state) => ({ wishlist: [...state.wishlist, item] })),

  // Remove an item from wishlist
  removeFromWishlist: (id) =>
    set((state) => ({ wishlist: state.wishlist.filter((item) => item.id !== id) })),
}));

export default useUserStore;