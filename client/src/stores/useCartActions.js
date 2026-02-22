// src/stores/useCartActions.js
import { create } from 'zustand';

export const useCartActions = create((set) => ({
  pendingAdd: null,
  setPendingAdd: (item) => set({ pendingAdd: item }),
  clearPending: () => set({ pendingAdd: null }),
}));