"use client";

import BottomNav from "./BottomNav";
import PageTransition from "./PageTransition";
import StatusBar from "./StatusBar";
import CartFab from "./CartFab";
import CartDrawer from "./CartDrawer";
import { useEffect, useState } from "react";

function PhoneStatusBar() {
  const [time, setTime] = useState("9:41");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(`${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="phone-statusbar select-none">
      <span>{time}</span>
      <span className="text-[10px] tracking-[0.3em] uppercase">Tasty</span>
    </div>
  );
}

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex justify-center sm:items-center sm:py-8 bg-bg-deep">
      {/* Mobile: full-bleed */}
      <div className="sm:hidden relative w-full min-h-screen bg-bg-primary flex flex-col">
        <main className="flex-1 pb-28">
          <StatusBar />
          <PageTransition>{children}</PageTransition>
        </main>
        <CartFab />
        <CartDrawer />
        <BottomNav />
      </div>

      {/* Desktop: phone frame */}
      <div className="hidden sm:block">
        <div className="phone-frame w-[400px] h-[844px]">
          <div className="phone-notch" />
          <div className="phone-screen w-full h-full flex flex-col">
            <PhoneStatusBar />
            <main className="flex-1 overflow-y-auto pb-28 no-scrollbar">
              <StatusBar />
              <PageTransition>{children}</PageTransition>
            </main>
            <CartFab />
            <CartDrawer />
            <BottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}

