# Frontend für Gastronomie Web-App

Next.js 14 React Application mit TypeScript, Tailwind CSS und modernen State Management Tools.

## 🚀 Features

- **Next.js 14** mit App Router
- **TypeScript** für Type-Safety
- **Tailwind CSS** für Styling
- **shadcn/ui** für hochwertige UI-Komponenten
- **React Query** für Server State Management
- **Zustand** für Client State Management
- **React Hook Form** für Form Management
- **Zod** für Schema Validierung

## 📁 Ordnerstruktur

```
src/
├── app/              # Next.js 14 App Router
├── components/       # Reusable React Components
├── hooks/            # Custom React Hooks
├── lib/              # Utils, API Clients, Helper Functions
├── types/            # TypeScript Types & Interfaces
├── store/            # Zustand Store (Auth, Cart, etc.)
└── styles/           # Global Styles
```

## 🛠️ Installation

```bash
npm install
```

## 🔧 Development

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## 📦 Build

```bash
npm run build
npm start
```

## 📝 Environment Variables

Erstelle `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🧪 Testing

```bash
npm run test
```

## 📚 Store Management

### Auth Store (`src/store/auth.ts`)
Verwaltet Benutzer-Authentifizierung und Token.

### Cart Store (`src/store/cart.ts`)
Verwaltet Warenkorb-Status und Artikel.

## 🔐 API Integration

API-Requests über `src/lib/axios.ts` mit automatischer Token-Verwaltung.
