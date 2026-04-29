"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const setAuth = useAuthStore((s) => s.login);
  const showToast = useUIStore((s) => s.showToast);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await register.mutateAsync({ name, email, password });
      setAuth(res.user, res.token);
      showToast(`Willkommen, ${res.user.name}`, "success");
      router.push("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Registrierung fehlgeschlagen";
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
          La Famiglia
        </p>
        <h1 className="font-serif text-4xl text-text-cream mt-3 leading-tight">
          Konto erstellen
        </h1>
        <p className="font-serif italic text-text-muted/80 mt-3 text-sm">
          Werden Sie Teil unserer Familie.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-12 space-y-7">
        <div>
          <label className="luxe-label">Name</label>
          <input
            type="text"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="luxe-input mt-2"
            placeholder="Vor- und Nachname"
          />
        </div>
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
            placeholder="Mindestens 6 Zeichen"
          />
        </div>

        {error && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-red-200/90">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={register.isPending}
          className="gold-underline-btn mt-8 inline-block"
        >
          {register.isPending ? "Anlegen…" : "Konto erstellen"}
        </button>
      </form>

      <p className="mt-12 text-[11px] uppercase tracking-[0.22em] text-text-faint">
        Bereits Mitglied?{" "}
        <Link href="/login" className="text-accent-gold border-b border-accent-gold/40 pb-0.5">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
