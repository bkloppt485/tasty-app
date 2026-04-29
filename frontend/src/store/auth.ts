import { create } from "zustand";
import type { User } from "@/types";
import { TOKEN_KEY, USER_KEY } from "@/lib/api";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,
  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  loadFromStorage: () => {
    if (typeof window === "undefined") {
      set({ hydrated: true });
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as User;
        set({ user, token, isAuthenticated: true, hydrated: true });
        return;
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    set({ hydrated: true });
  },
}));
