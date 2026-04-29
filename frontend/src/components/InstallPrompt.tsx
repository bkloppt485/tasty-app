"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "tasty-pwa-dismissed-at";
const DISMISS_DAYS = 14;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !/Windows/.test(ua);
}

function recentlyDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const at = window.localStorage.getItem(DISMISS_KEY);
  if (!at) return false;
  const ts = parseInt(at, 10);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    if (isIos()) {
      // Only show after a small delay so it's not intrusive
      const t = setTimeout(() => {
        setIosHint(true);
        setShow(true);
      }, 4000);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted" || choice.outcome === "dismissed") {
      dismiss();
    }
    setDeferred(null);
  }

  if (!show) return null;

  return (
    <div
      className="fixed left-3 right-3 z-[60] rounded-2xl shadow-lg backdrop-blur-md"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        background: "rgba(45,10,15,0.96)",
        border: "1px solid rgba(201,162,74,0.35)",
        color: "#FAF6EE",
      }}
      role="dialog"
      aria-label="App installieren"
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "#7A1E2A",
            border: "1px solid rgba(201,162,74,0.6)",
          }}
        >
          <span className="font-serif text-xl">T</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base leading-tight mb-1">
            Tasty als App installieren
          </p>
          {iosHint ? (
            <p className="text-xs leading-relaxed text-text-cream/80">
              Tippe unten auf{" "}
              <span aria-label="Teilen" className="inline-block">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="inline align-text-bottom"
                >
                  <path d="M12 2v14M6 8l6-6 6 6" />
                  <path d="M5 14v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
                </svg>
              </span>{" "}
              und wähle{" "}
              <span className="font-medium">{`„Zum Home-Bildschirm"`}</span>.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-text-cream/80">
              Schneller Zugriff vom Home-Bildschirm – ohne Browser-Leiste.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {!iosHint && (
            <button
              onClick={install}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: "#C9A24A", color: "#2D0A0F" }}
            >
              Installieren
            </button>
          )}
          <button
            onClick={dismiss}
            className="text-xs px-3 py-1.5 rounded-full text-text-cream/70 hover:text-text-cream"
            aria-label="Hinweis schließen"
          >
            Später
          </button>
        </div>
      </div>
    </div>
  );
}
