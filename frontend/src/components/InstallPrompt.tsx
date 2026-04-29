"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "tasty-pwa-dismissed-at";
const DISMISS_DAYS = 14;
const SHOW_DELAY_MS = 2400;
const LEAVE_MS = 320;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
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
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false); // controls slide-in
  const [leaving, setLeaving] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    let cleanup: (() => void) | undefined;

    if (isIos()) {
      const t = setTimeout(() => {
        setIosHint(true);
        setMounted(true);
        // double-rAF so the enter animation triggers reliably
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      }, 4000);
      cleanup = () => clearTimeout(t);
    } else {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferred(e as BeforeInstallPromptEvent);
        // small delay so it doesn't pop instantly on page load
        setTimeout(() => {
          setMounted(true);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setVisible(true)),
          );
        }, SHOW_DELAY_MS);
      };
      window.addEventListener("beforeinstallprompt", handler);
      cleanup = () =>
        window.removeEventListener("beforeinstallprompt", handler);
    }

    return cleanup;
  }, []);

  function close(persist = true) {
    if (persist) {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setLeaving(true);
    setTimeout(() => {
      setMounted(false);
      setLeaving(false);
      setVisible(false);
    }, LEAVE_MS);
  }

  async function install() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
    close(true);
  }

  if (!mounted) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-[60] px-3 ${visible && !leaving ? "install-prompt-enter" : ""} ${leaving ? "install-prompt-leave" : ""}`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)",
        opacity: visible || leaving ? undefined : 0,
        pointerEvents: leaving ? "none" : "auto",
      }}
      role="dialog"
      aria-label="App installieren"
    >
      <div
        className="mx-auto max-w-md relative overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(36,15,18,0.96) 0%, rgba(45,10,15,0.97) 100%)",
          border: "1px solid rgba(201,164,92,0.32)",
          boxShadow:
            "0 24px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,164,92,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          color: "#FAF6EE",
        }}
      >
        {/* decorative gold sheen */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,164,92,0.55) 50%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-20 h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{ background: "rgba(201,164,92,0.25)" }}
        />

        <button
          onClick={() => close(true)}
          aria-label="Hinweis schließen"
          className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full flex items-center justify-center text-text-cream/50 hover:text-text-cream hover:bg-white/5 transition-colors"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>

        <div className="flex items-start gap-3.5 p-4 pr-10">
          <div
            className="install-icon-glow w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
            style={{
              background:
                "linear-gradient(145deg, #8A2230 0%, #5C1620 100%)",
              border: "1px solid rgba(201,164,92,0.55)",
            }}
          >
            <span
              className="font-serif text-xl"
              style={{ color: "#F5EDE0", letterSpacing: "0.04em" }}
            >
              T
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-serif text-[15px] leading-tight mb-1"
              style={{ color: "#F5EDE0" }}
            >
              Tasty als App installieren
            </p>
            {iosHint ? (
              <p className="text-[12px] leading-relaxed text-text-cream/75">
                Tippe auf{" "}
                <Share
                  className="install-arrow inline-block align-text-bottom mx-0.5"
                  style={{ width: 13, height: 13, color: "#C9A24A" }}
                  strokeWidth={2}
                />{" "}
                und wähle{" "}
                <span style={{ color: "#C9A24A" }}>
                  {`„Zum Home-Bildschirm"`}
                </span>
                .
              </p>
            ) : (
              <p className="text-[12px] leading-relaxed text-text-cream/75">
                Vom Home-Bildschirm starten — ohne Browser, mit Push-Benachrichtigungen.
              </p>
            )}

            {!iosHint && (
              <button
                onClick={install}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-[12px] tracking-wide transition-transform active:scale-95"
                style={{
                  background:
                    "linear-gradient(180deg, #D8B25C 0%, #B68C2F 100%)",
                  color: "#2D0A0F",
                  boxShadow:
                    "0 4px 14px -4px rgba(201,164,92,0.5), inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2.2} />
                Installieren
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
