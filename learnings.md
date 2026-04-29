# Learnings — Tasty Web-App

Wachsendes Projekt-Memory: Was schief ging, wie wir es gelöst haben, welche Regel daraus wurde.

---

## 2026-04-XX: next.config.cjs wird ignoriert
- **Problem:** Whitescreen beim Öffnen, Unsplash-Bilder schlugen fehl mit 500
- **Root Cause:** Next.js 14 liest NUR `next.config.js` oder `next.config.mjs`, NICHT `.cjs` — Datei wurde komplett ignoriert
- **Solution:** Umbenannt zu `next.config.mjs` mit `export default nextConfig` ESM-Syntax
- **Regel:** `next.config` MUSS `.mjs` mit `export default` sein. Andere Configs (postcss/tailwind) bleiben `.cjs`

## 2026-04-XX: SQLite + Prisma Enums = Fail
- **Problem:** Prisma migrate crashte mit "enum not supported"
- **Root Cause:** SQLite kann keine Enums
- **Solution:** Alle enum fields zu `String` mit Comment-Annotation: `role String // CUSTOMER|ADMIN|RESTAURANT_MANAGER`
- **Regel:** NIEMALS `enum` in diesem Schema. Strings mit Comments dokumentieren erlaubte Werte

## 2026-04-XX: Falsche jsonwebtoken Version
- **Problem:** `npm install` failed
- **Root Cause:** `jsonwebtoken@^9.1.2` existiert nicht
- **Solution:** Auf `9.0.2` festgenagelt
- **Regel:** Bei Dependencies: existierende Versionen prüfen, nicht raten

## 2026-04-XX: Haiku-Agent zerstörte Tailwind-Config
- **Problem:** "Color Variant" Aufgabe sollte 3 Paletten erstellen, hat stattdessen `accent-gold` zu Bordeaux umbenannt → Buttons unleserlich
- **Root Cause:** Haiku-Agent oberflächlich; hat Token-Namen geswapped statt Design zu durchdenken
- **Solution:** Tailwind komplett neu aufgesetzt mit echtem Gold + Bordeaux + Cream als getrennte Tokens
- **Regel:**
  - Design-Arbeit IMMER mit Opus, NIE mit Haiku
  - Tokens haben semantische Namen (`accent-gold`, `bordeaux`) — niemals Werte tauschen ohne globalen Refactor

## 2026-04-XX: Webpack-Cache-Korruption nach Hot-Reload
- **Problem:** "Cannot find module './438.js'" → 500 für alle Resources, Whitescreen
- **Solution:** `Remove-Item -R -Force .next` + neu starten
- **Regel:** Bei mysteriösen Module-Errors: erst `.next` löschen, dann debuggen

## 2026-04-XX: User wollte einladenden Single-Restaurant-Look
- **Problem:** Iteration 1+2 sahen aus wie Lieferando/Temu Marketplace (bunte Tags, fette Buttons)
- **Solution:** Iteration 3 = Premium Italian (Bordeaux/Gold/Cream), Iteration 4 = hell (Cream Basis, Bordeaux nur Akzent)
- **Regel:** Keine Marketplace-Tropes (no "10% off!" Badges, keine bunten Konfetti, keine fetten CTAs)
- **Style:** Editorial, ruhig, "Sie"-Form, italienisch-elegant, kleine Gold-Underline-Buttons statt Bordeaux-Blocks

## 2026-04-XX: Coupons als Code-Eingabe falsch
- **Problem:** User wollte Personalisierung
- **Solution:** Coupons → "Angebote" mit Bild + Aktivieren-Button. Backend `CouponRedemption` Tabelle für 1×-Einlösung pro User
- **Regel:** Keine Code-Eingabe-Felder. Angebote sind sichtbar + auswählbar

## 2026-04-XX: Header sollte sticky aber Status soll mitscrollen
- **Problem:** "Jetzt geöffnet" war im sticky Header, blieb beim Scrollen — User wollte das es verschwindet
- **Solution:** StatusBar Component separat ÜBER Header platziert, scrollt mit. Header (Logo + Profil) bleibt sticky
- **Regel:** Sticky ≠ alles oben. Trennung: was bleibt vs. was scrollt mit

---

## Offene Fragen / TODOs für nächste Sessions
- Admin-Panel für Restaurant-Manager (Produkte/Coupons verwalten)
- Echte Profil-Daten-Bearbeitung
- Push-Notifications für Angebote
- Deployment für Demo-Sharing (Vercel + Railway?)
- E-Mail-Versand bei Reservierungs-Bestätigung


## 2026-04-29  React Query Cache nach Login

useLogin/useRegister müssen \queryClient.invalidateQueries\ für authentifizierungs-abhängige Queries aufrufen (\coupons\, \orders\, \eservations,me\). Sonst zeigen vor dem Login geladene Caches (z.B. \edeemedByMe: false\) den falschen, unauthenticated Zustand bis zum nächsten manuellen Refetch. Symptom: Coupon-Redeem scheint zu fehlen, obwohl das Backend 201 zurückgibt.
