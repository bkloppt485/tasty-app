# Tasty Deploy — Vercel (Frontend) + Render (Backend) + Neon (Postgres)

## 1. Neon (Database)
1. Sign up at https://neon.tech (Github-Login)
2. Create new project → choose region (Frankfurt for EU)
3. Copy the **Connection string** (starts with `postgresql://...?sslmode=require`)
4. This is your `DATABASE_URL`

## 2. Render (Backend)
1. Sign up at https://render.com (Github-Login)
2. **New → Web Service** → Connect your `tasty-app` GitHub repo
3. Configuration:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Environment variables:
   - `DATABASE_URL` = Neon connection string
   - `JWT_SECRET` = random long string (e.g. from `openssl rand -hex 32`)
   - `NODE_ENV` = `production`
   - `CORS_ORIGINS` = `*` for now (tighten after Vercel deploy)
5. Deploy → wait ~3 min → note the URL (e.g. `https://tasty-backend.onrender.com`)
6. Verify: open `https://tasty-backend.onrender.com/api/health` — should return JSON

> **Free-tier note:** Backend sleeps after 15 min idle → first request takes ~30s.

## 3. Vercel (Frontend)
1. Sign up at https://vercel.com (Github-Login)
2. **Add New → Project** → Import your `tasty-app` repo
3. Configuration:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (auto-detected)
4. Environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://tasty-backend.onrender.com/api`
5. Deploy → ~2 min → note the URL (e.g. `https://tasty-app.vercel.app`)

## 4. Tighten CORS
Back in Render → Backend → Environment:
- Change `CORS_ORIGINS` to `https://tasty-app.vercel.app,https://*.vercel.app`
- Save → backend auto-restarts

## 5. iPhone — App-Feeling
1. Open `https://tasty-app.vercel.app` in Safari on iPhone
2. Tap Share → **Zum Home-Bildschirm**
3. Icon erscheint, App startet im Vollbild

## Test-Accounts (gleich wie lokal)
- Customer: `customer@example.de` / `customer123`
- Admin: `admin@gastro.de` / `admin123`
