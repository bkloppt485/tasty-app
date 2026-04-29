# 🍽️ Gastronomie Web-App

Eine moderne, vollständig entwickelte Web-Anwendung für Gastronomie-Betriebe mit Bestellverwaltung, Benutzerverwaltung und Coupon-System.

## 📋 Übersicht

- **Frontend**: Next.js 14 mit React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js mit Express und TypeScript
- **Database**: PostgreSQL mit Prisma ORM
- **Authentication**: JWT-basierte Authentifizierung
- **Deployment**: Docker & Docker Compose

## 🏗️ Projekt-Struktur

```
gastro-webapp/
├── frontend/          # Next.js React Application
├── backend/           # Express.js API Server
├── docs/              # Dokumentation
├── docker-compose.yml # Docker Setup für lokale Entwicklung
├── package.json       # Root Scripts
├── .gitignore         # Git Ignore Datei
└── README.md          # Projekt-Dokumentation
```

## 🚀 Quick Start

### Voraussetzungen
- Node.js 20+
- npm oder yarn
- Docker & Docker Compose (optional, für containerisierte Entwicklung)
- PostgreSQL 15+ (oder nutze Docker Compose)

### Installation

```bash
# Ins Projekt-Verzeichnis wechseln
cd gastro-webapp

# Alle Dependencies installieren
npm run setup

# Lokal entwickeln (ohne Docker)
npm run dev:local

# Oder mit Docker
npm run dev
```

### Environment Setup

```bash
# Backend
cd backend
cp .env.example .env
# Bearbeite .env mit deinen Einstellungen

# Frontend
cd ../frontend
cp .env.example .env.local
```

## 📚 Tech-Stack

### Frontend
- **Next.js 14** - React Framework mit App Router
- **TypeScript** - Statische Typisierung
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Hochwertige UI-Komponenten
- **React Query** - State Management für Server-Daten
- **Zustand** - Globaler Client State
- **Zod** - Schema Validierung
- **React Hook Form** - Form Management

### Backend
- **Express.js** - Web Framework
- **TypeScript** - Statische Typisierung
- **Prisma** - ORM für Datenbanken
- **JWT** - Token-basierte Authentifizierung
- **bcryptjs** - Password Hashing
- **Zod** - Input Validierung
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security Headers

### Database
- **PostgreSQL 15** - Relationale Datenbank
- **Prisma Client** - Datenbank-Zugriff

## 📖 Dokumentation

Detaillierte Dokumentation findest du im `/docs` Verzeichnis:
- Architecture Overview
- API Documentation
- Setup Guides
- Database Schema

## 🔐 Sicherheit

- JWT Token-basierte Authentifizierung
- Bcryptjs für sichere Password-Hashing
- CORS Konfiguration
- Security Headers mit Helmet
- Input Validierung mit Zod

## 📦 Verfügbare Scripts

```bash
# Root Level
npm run setup              # Alle Dependencies installieren
npm run dev              # Starte mit Docker Compose
npm run dev:local        # Starte beide Apps lokal
npm run dev:backend      # Nur Backend entwickeln
npm run dev:frontend     # Nur Frontend entwickeln
```

## 🗄️ Datenbank

### Migrationen
```bash
cd backend
npx prisma migrate dev --name <migration_name>
```

### Seed Datenbank
```bash
cd backend
npx prisma db seed
```

## 👥 Benutzer-Rollen

- **CUSTOMER** - Normale Kunden
- **ADMIN** - Administratoren
- **RESTAURANT_MANAGER** - Restaurant-Manager

## 📝 Lizenz

MIT

## 👨‍💻 Development

Für weitere Entwicklung siehe:
- Frontend: `/frontend/README.md`
- Backend: `/backend/README.md`
