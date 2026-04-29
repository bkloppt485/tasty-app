"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import SplashScreen from "@/components/SplashScreen";
import MobileLayout from "@/components/MobileLayout";
import LoginModal from "@/components/LoginModal";
import Toast from "@/components/Toast";

const MODAL_DISMISSED_KEY = "tasty_modal_dismissed";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1 },
        },
      })
  );
  const [splashDone, setSplashDone] = useState(false);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const openLoginModal = useUIStore((s) => s.openLoginModal);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("tasty:unauthorized", handler);
    return () => window.removeEventListener("tasty:unauthorized", handler);
  }, [logout]);

  useEffect(() => {
    if (!splashDone) return;
    if (isAuthenticated) return;
    const dismissed = sessionStorage.getItem(MODAL_DISMISSED_KEY);
    if (!dismissed) {
      const t = setTimeout(() => openLoginModal(), 250);
      return () => clearTimeout(t);
    }
  }, [splashDone, isAuthenticated, openLoginModal]);

  return (
    <QueryClientProvider client={client}>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <MobileLayout>{children}</MobileLayout>
      <LoginModal />
      <Toast />
    </QueryClientProvider>
  );
}
