"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useLogin } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const setAuth = useAuthStore((s) => s.login);
  const showToast = useUIStore((s) => s.showToast);
  const [email, setEmail] = useState("customer@example.de");
  const [password, setPassword] = useState("customer123");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login.mutateAsync({ email, password });
      setAuth(res.user, res.token);
      showToast(`Willkommen, ${res.user.name}`, "success");
      router.push("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Login fehlgeschlagen";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen px-8 pt-6 bg-bg-primary">
      <button
        onClick={() => router.back()}
        className="h-9 w-9 rounded-full border border-accent-gold/40 text-accent-gold flex items-center justify-center press hover:border-accent-gold transition-colors"
        aria-label="Zurück"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
      </button>

      <div className="mt-12 animate-fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold/70">
          Bentornato
        </p>
        <h1 className="font-serif text-4xl text-text-cream mt-3 leading-tight">
          Willkommen zurück
        </h1>
        <p className="font-serif italic text-text-muted/80 mt-3 text-sm">
          Melden Sie sich bei Tasty an.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-12 space-y-7">
        <div>
          <label className="luxe-label">E-Mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="luxe-input mt-2"
            placeholder="ihre@adresse.de"
          />
        </div>
        <div>
          <label className="luxe-label">Passwort</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="luxe-input mt-2"
            placeholder="••••••"
          />
        </div>

        {error && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-red-200/90">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="gold-underline-btn mt-8 inline-block"
        >
          {login.isPending ? "Anmelden…" : "Anmelden"}
        </button>
      </form>

      <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-text-faint">
        Noch kein Konto?{" "}
        <Link href="/register" className="text-accent-gold border-b border-accent-gold/40 pb-0.5">
          Registrieren
        </Link>
      </p>
    </div>
  );
}
