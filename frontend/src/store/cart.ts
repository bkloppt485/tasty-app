import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setNotes: (productId: string, notes: string) => void;
  getQuantity: (productId: string) => number;
  clear: () => void;
  totalCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),
      setNotes: (productId, notes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, notes } : i
          ),
        })),
      getQuantity: (productId) =>
        get().items.find((i) => i.product.id === productId)?.quantity ?? 0,
      clear: () => set({ items: [] }),
      totalCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
    }),
    {
      name: "tasty_cart",
      storage: createJSONStorage(() => localStorage),
      version: 2,
    }
  )
);

