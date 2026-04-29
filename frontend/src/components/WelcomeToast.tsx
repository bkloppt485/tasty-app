"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

const KEY = "tasty-welcome-shown-v1";

export default function WelcomeToast() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(KEY)) return;

    const t1 = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
    }, 1200);

    const t2 = setTimeout(() => {
      close();
    }, 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    setLeaving(true);
    setTimeout(() => {
      setMounted(false);
      setLeaving(false);
      setVisible(false);
      try {
        window.localStorage.setItem(KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    }, 320);
  }

  if (!mounted) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-[70] px-3 ${visible && !leaving ? "install-prompt-enter" : ""} ${leaving ? "install-prompt-leave" : ""}`}
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 12px)",
        opacity: visible || leaving ? undefined : 0,
        pointerEvents: leaving ? "none" : "auto",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="mx-auto max-w-md relative overflow-hidden rounded-2xl px-4 py-3 pr-10 flex items-start gap-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(36,15,18,0.96) 0%, rgba(45,10,15,0.97) 100%)",
          border: "1px solid rgba(201,164,92,0.32)",
          boxShadow:
            "0 16px 40px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          color: "#FAF6EE",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,164,92,0.55), transparent)",
          }}
        />
        <div
          className="install-icon-glow flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, #8A2230 0%, #5C1620 100%)",
            border: "1px solid rgba(201,164,92,0.55)",
          }}
        >
          <Sparkles
            className="h-4 w-4"
            style={{ color: "#D8B25C" }}
            strokeWidth={1.8}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-serif text-[14px] leading-tight"
            style={{ color: "#F5EDE0" }}
          >
            Benvenuti — willkommen bei Tasty.
          </p>
          <p className="text-[12px] leading-snug text-text-cream/70 mt-0.5">
            Entdecken Sie unsere Karte und persönliche Aufmerksamkeiten.
          </p>
        </div>
        <button
          onClick={close}
          aria-label="Schließen"
          className="absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center text-text-cream/50 hover:text-text-cream hover:bg-white/5 transition-colors"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
