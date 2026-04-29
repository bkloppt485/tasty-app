"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui";

const MODAL_DISMISSED_KEY = "tasty_modal_dismissed";

export default function LoginModal() {
  const open = useUIStore((s) => s.loginModalOpen);
  const close = useUIStore((s) => s.closeLoginModal);
  const router = useRouter();

  if (!open) return null;

  const dismiss = () => {
    sessionStorage.setItem(MODAL_DISMISSED_KEY, "1");
    close();
  };

  const go = (path: string) => {
    sessionStorage.setItem(MODAL_DISMISSED_KEY, "1");
    close();
    router.push(path);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-[440px] mx-auto bg-bg-primary border-t border-border-gold rounded-t-[2rem] px-8 pt-5 pb-10 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-accent-gold/30" />

        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold/70">
            Benvenuto
          </p>
          <h2 className="font-serif text-3xl text-text-cream mt-2 leading-tight">
            Willkommen bei{" "}
            <span className="font-script text-accent-gold">Tasty</span>
          </h2>
          <p className="text-sm text-text-muted mt-3 leading-relaxed max-w-sm">
            Erleben Sie unser Menü in voller Pracht — mit persönlichen
            Aufmerksamkeiten und gespeicherten Bestellungen.
          </p>
        </div>

        <div className="mt-9 flex flex-col items-start gap-6">
          <button onClick={() => go("/login")} className="gold-underline-btn">
            Anmelden
          </button>
          <button
            onClick={() => go("/register")}
            className="gold-underline-btn"
          >
            Konto erstellen
          </button>
        </div>

        <button
          onClick={dismiss}
          className="block mt-10 text-[11px] uppercase tracking-[0.2em] text-text-faint hover:text-text-muted transition-colors"
        >
          Ohne Anmeldung fortfahren
        </button>
      </div>
    </div>
  );
}
