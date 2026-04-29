import { create } from "zustand";

interface UIStore {
  loginModalOpen: boolean;
  cartDrawerOpen: boolean;
  toast: { id: number; message: string; type: "info" | "success" | "error" } | null;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  showToast: (message: string, type?: "info" | "success" | "error") => void;
  clearToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  loginModalOpen: false,
  cartDrawerOpen: false,
  toast: null,
  openLoginModal: () => set({ loginModalOpen: true }),
  closeLoginModal: () => set({ loginModalOpen: false }),
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  showToast: (message, type = "info") =>
    set({ toast: { id: Date.now(), message, type } }),
  clearToast: () => set({ toast: null }),
}));
