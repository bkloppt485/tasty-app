# 🚀 Setup Anleitung

## Voraussetzungen

- Node.js 20+
- npm oder yarn
- Docker & Docker Compose (optional, für containerisierte Entwicklung)
- PostgreSQL 15 (oder nutze Docker)

## Option 1: Lokale Entwicklung (ohne Docker)

### 1. Repository klonen/öffnen

```bash
cd C:\Users\hanklide\gastro-webapp
```

### 2. Environment Setup

**Backend:**
```bash
cd backend
cp .env.example .env
```

Bearbeite `backend/.env`:
```
DATABASE_URL=postgresql://gastro_user:gastro_password@localhost:5432/gastro_db
JWT_SECRET=dev-secret-key-change-in-production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend:**
```bash
cd ../frontend
cp .env.example .env.local
```

Die `.env.local` sollte bereits korrekt sein:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Dependencies installieren

```bash
# Ins Root-Verzeichnis
cd ..

# Alle Dependencies installieren
npm run setup
```

### 4. Datenbank Setup

**PostgreSQL lokal starten** (oder Docker):

```bash
# Option A: Mit Docker
docker run --name gastro_postgres \
  -e POSTGRES_USER=gastro_user \
  -e POSTGRES_PASSWORD=gastro_password \
  -e POSTGRES_DB=gastro_db \
  -p 5432:5432 \
  -d postgres:15-alpine

# Option B: PostgreSQL muss lokal laufen
# Siehe: https://www.postgresql.org/download/
```

**Prisma Migrations ausführen:**

```bash
cd backend
npx prisma migrate dev --name init
```

**Datenbank mit Test-Daten seeden:**

```bash
npm run db:seed
```

### 5. Anwendungen starten

```bash
# Im Root-Verzeichnis
npm run dev:local
```

Das startet:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

---

## Option 2: Lokale Entwicklung (mit Docker)

### 1. Environment Setup

Nur Frontend .env.local erstellen:

```bash
cd frontend
cp .env.example .env.local
```

### 2. Docker Compose starten

```bash
cd ..
npm run dev
```

oder:

```bash
docker-compose up
```

Das startet automatisch:
- PostgreSQL (Port 5432)
- Backend (Port 3001)
- Frontend (Port 3000)

### 3. Datenbank initialisieren

```bash
# In einem neuen Terminal
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npm run db:seed
```

---

## Zugriff auf die Anwendung

### Frontend
- URL: http://localhost:3000
- Status: Landing Page mit Setup-Übersicht

### Backend API
- URL: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

### Database (Prisma Studio)

```bash
cd backend
npx prisma studio
```

Öffnet: http://localhost:5555

---

## Test-Accounts

Nach dem Seeding sind folgende Accounts verfügbar:

**Admin:**
- Email: `admin@gastro.de`
- Password: `admin123`

**Customer:**
- Email: `customer@example.de`
- Password: `customer123`

---

## Common Commands

### Development

```bash
# Alles installieren
npm run setup

# Frontend dev server
npm run dev:frontend

# Backend dev server
npm run dev:backend

# Mit Docker
npm run dev

# Beides parallel lokal
npm run dev:local
```

### Database

```bash
# Neue Migration erstellen
cd backend && npx prisma migrate dev --name <name>

# Prisma Studio öffnen
cd backend && npx prisma studio

# Datenbank mit Seeds füllen
cd backend && npm run db:seed

# Datenbank zurücksetzen (Vorsicht!)
cd backend && npx prisma migrate reset
```

### Build & Production

```bash
# Beides bauen
npm run build

# Backend bauen
npm run build:backend

# Frontend bauen
npm run build:frontend
```

---

## Troubleshooting

### "Cannot find module '@/...'"

Die TypeScript Paths sind falsch konfiguriert. Prüfe:
- Frontend: `tsconfig.json` in `frontend/`
- Backend: `tsconfig.json` in `backend/`

Beide sollten `"@/*": ["./src/*"]` haben.

### "Database connection failed"

1. Prüfe `DATABASE_URL` in `backend/.env`
2. Stelle sicher, dass PostgreSQL läuft:
   ```bash
   # Check with Docker
   docker ps | grep postgres
   ```
3. Versuche Verbindung zu testen:
   ```bash
   psql postgresql://gastro_user:gastro_password@localhost:5432/gastro_db
   ```

### "Port 3000/3001 already in use"

```bash
# Port 3000 freigeben (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Port 3001 freigeben
lsof -ti:3001 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Docker Container startet nicht

```bash
# Logs anschauen
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Alles neubau und starten
docker-compose down -v
docker-compose up --build
```

---

## Nächste Schritte (Phase 2+)

- [ ] API Endpoints implementieren (Orders, Coupons)
- [ ] Frontend UI Komponenten bauen
- [ ] Tests schreiben
- [ ] Authentication UI
- [ ] Product Catalog UI
- [ ] Shopping Cart
- [ ] Checkout Process
- [ ] Admin Dashboard
