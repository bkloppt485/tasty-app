# Backend API für Gastronomie Web-App

Node.js Express API mit TypeScript, Prisma ORM und JWT-Authentifizierung.

## 🚀 Features

- **Express.js** Web Framework
- **TypeScript** für Type-Safety
- **Prisma** als ORM für PostgreSQL
- **JWT** für Token-basierte Authentifizierung
- **Zod** für Input-Validierung
- **CORS & Helmet** für Sicherheit
- **Bcryptjs** für sichere Passwort-Hashing

## 📁 Ordnerstruktur

```
src/
├── config/       # Umgebungsvariablen und Konfiguration
├── database/     # Prisma Client Setup
├── routes/       # API Route Handler
├── controllers/  # Business Logic
├── middleware/   # Custom Middleware
├── types/        # TypeScript Types & Schemas
├── utils/        # Helper Functions
└── server.ts     # Entry Point
```

## 🛠️ Installation

```bash
npm install
```

## 🔧 Development

```bash
npm run dev
```

Der Server läuft dann auf `http://localhost:3001`.

## 📦 Build & Start

```bash
npm run build
npm start
```

## 🗄️ Datenbank Setup

### Environment einrichten
```bash
cp .env.example .env
# Bearbeite .env mit deinen Einstellungen
```

### Migrations ausführen
```bash
npx prisma migrate dev --name init
```

### Prisma Studio öffnen
```bash
npx prisma studio
```

## 📚 API Endpoints

### Health Check
- `GET /api/health` - Server Status

### Authentication
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Login

### Products
- `GET /api/products` - Alle Produkte
- `POST /api/products` - Produkt erstellen (Admin)
- `GET /api/products/:id` - Produkt Details

## 🔐 Authentication

Requests müssen einen JWT Token im `Authorization` Header enthalten:

```
Authorization: Bearer <token>
```

## 📝 Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
