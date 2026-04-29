# Tasty Restaurant Web-App

Demo-App eines einzelnen Restaurants (Döner + Italienisch in Kassel) als Showcase für Gastronomie-Kunden. Soll wie die App des Restaurants wirken — NICHT wie Lieferando/Marketplace.

## Tech Stack
- **Frontend:** Next.js 14 App Router, TypeScript strict, Tailwind, Zustand, TanStack Query, läuft auf :3000
- **Backend:** Express, Prisma, SQLite, Zod, läuft auf :3001
- **Auth:** JWT in localStorage (`tasty_auth_token`, `tasty_user`)

## File Map
- `frontend/src/app/*` — App-Router Routes (page.tsx je Route)
- `frontend/src/components/*` — Shared UI (Header, BottomNav, CouponCard, etc.)
- `frontend/src/store/*` — Zustand stores (auth, ui)
- `frontend/src/hooks/queries.ts` — ALLE TanStack Query Hooks zentral
- `backend/src/routes/*` — Express Router pro Resource (products, coupons, reservations, orders, auth)
- `backend/src/server.ts` — Server-Bootstrap + Router-Mounting
- `backend/prisma/schema.prisma` — Single source of truth für DB
- `backend/prisma/seed.ts` — Seed-Daten

## Conventions

### DO
- TypeScript strict mode
- Named exports (außer Pages/Layouts in App-Router)
- Tailwind-Klassen (kein inline style)
- "Sie"-Form in user-facing Deutsch (italienische Eleganz)
- TanStack Query für ALLE API-Calls
- Lucide-React für Icons
- Date-Handling über native Date / ISO strings

### DON'T
- ❌ Enums in Prisma — SQLite supports nicht. Nutze `String` mit Comment-Annotation: `status String // PENDING|CONFIRMED|CANCELLED`
- ❌ `any` Type
- ❌ console.log in committed code
- ❌ Default exports außer Pages/Layouts
- ❌ Inline-Styles
- ❌ Code-Eingabe-Felder für Coupons (User will Auswahl, nicht eintippen)

## Brand / Design Tokens (aktuell, Iteration 4+)
- **BG:** Cream `#FAF6EE` (Haupthintergrund)
- **Bordeaux:** `#7A1E2A` (Header, Promo-Blocks, CTAs)
- **Gold:** `#C9A45C` (Akzent-Linien, kleine Labels)
- **Text:** `#2A1A1C` (dark Bordeaux-Schwarz)
- **Muted:** `#7A6A6C`
- **Surface (Karten):** Weiß mit `border border-border-subtle` + `shadow-sm`

## Fonts (next/font/google in layout.tsx)
- **Pacifico** — NUR für "Tasty" Logo
- **Cormorant Garamond** — Headings, Speisen-Namen (italienische Eleganz)
- **Inter** — Body-Text

## Dev Commands
```powershell
# Frontend
cd C:\Users\hanklide\gastro-webapp\frontend
npm run dev          # :3000
npm run build        # production check
Remove-Item -R -Force .next  # Cache löschen wenn Webpack-Errors

# Backend
cd C:\Users\hanklide\gastro-webapp\backend
npm run dev          # :3001
npx prisma migrate dev --name <name>   # nach Schema-Änderung
npx prisma db seed
Remove-Item prisma\dev.db; npx prisma migrate dev   # Notfall-Reset (Demo-DB)
```

**Backend NEUSTART nötig nach:** Prisma-Schema-Änderung (kill async shell "backend", neu starten)
**Frontend `.next` löschen wenn:** "Cannot find module './XXX.js'" (Webpack-Cache korrupt)

## Verification (vor "done")
1. `cd frontend; npm run build` → grün, alle Routes kompilieren
2. `Invoke-WebRequest http://localhost:3000` → Status 200
3. Neue API-Endpoints mit `Invoke-WebRequest` smoke-getestet
4. Keine TS-Errors in modifizierten Files
5. Bei Schema-Änderung: `npx prisma migrate dev` lief erfolgreich

## Known Pitfalls (siehe auch learnings.md)
- `next.config.cjs` wird IGNORIERT von Next 14 — muss `next.config.mjs` mit `export default` sein (weil package.json `"type":"module"` hat)
- `tailwind.config.cjs` und `postcss.config.cjs` müssen `.cjs` bleiben (sonst CommonJS-Fehler)
- SQLite hat KEINE Enums — string + comment-annotation
- `accent-gold` ist GOLD `#C9A45C`, NICHT Bordeaux. Niemals umbenennen ohne globalen Refactor!
- `jsonwebtoken@9.0.2` (nicht 9.1.2 — existiert nicht)
- Keine `@radix-ui/react-primitive` (existiert nicht standalone)
- Backend-Routes brauchen JWT-Middleware-Order: Auth-Middleware VOR Route-Handlern

## Persistente Auth
- Zustand-Store `useAuthStore` in `src/store/auth.ts`
- `loadFromStorage()` wird in `Providers.tsx` beim Mount aufgerufen
- Logout-Event: `tasty:unauthorized` (für 401-Handling)

## App-Konzept (Domain-Wissen)
- 4 Bottom-Tabs: **Start / Bestellen / Coupons (= Angebote) / Profil**
- Splash-Screen 2-3s + Login-Modal (closeable, mit Limitations)
- Gast kann browsen, Coupons/Bestellen erfordert Login
- Coupons heißen "Angebote" — auswählbar, NICHT Code-eingeben
- Coupons nur 1× pro User einlösbar (CouponRedemption Tabelle)
- Reservierungen: Mo-So 11:00-22:00, max 12 Personen
- Profil = Listen-Menü mit 9 Punkten (jeder eine Sub-Seite mit Zurück-Pfeil):
  Mein Profil, Vorherige Bestellungen, Reservierungen, Restaurant, Produkte, Kontakt, Impressum, AGB, Datenschutz

## Test-Accounts (aus Seed)
- `customer@example.de` / `customer123`
- `admin@gastro.de` / `admin123`

## Out-of-Scope (nicht ändern ohne explizite Anfrage)
- `next.config.mjs` Struktur
- `package.json` `type` field
- Auth-Flow (funktioniert)
- Phone-Frame Wrapper auf Desktop (sm: breakpoint)

## Acceptance Criteria Format
Jede Aufgabe braucht:
- HTTP-Contract (method, path, body, response shape, status codes) wenn Backend
- UI-Verhalten (welche Page, was sieht User, was passiert bei Click) wenn Frontend
- Build/Smoke-Verifikations-Befehl
