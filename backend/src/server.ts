import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "@/config/env";
import healthRoutes from "@/routes/health";
import authRoutes from "@/routes/auth";
import productRoutes from "@/routes/products";
import couponRoutes from "@/routes/coupons";
import orderRoutes from "@/routes/orders";
import reservationRoutes from "@/routes/reservations";
import adminRoutes from "@/routes/admin";
import pushRoutes from "@/routes/push";
import restaurantRoutes from "@/routes/restaurant";
import { prisma } from "@/database/prisma";

const app = express();

// Trust the first proxy (Render) so rate-limit & req.ip work correctly
app.set("trust proxy", 1);

// Middleware
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS ?? config.frontendUrl)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const wildcardAllowed = allowedOrigins.includes("*");
if (wildcardAllowed && config.isProduction) {
  console.warn(
    "⚠️  CORS_ORIGINS=* in production: credentials will be disabled to avoid CSRF. Set explicit origins."
  );
}

// Build per-origin host matchers from allowlist (exact host or .suffix-only match)
const allowedHostMatchers = allowedOrigins
  .filter((o) => o !== "*")
  .map((o) => {
    const stripped = o.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const wildcardSub = stripped.startsWith("*.");
    const host = wildcardSub ? stripped.slice(2) : stripped;
    return { host, wildcardSub };
  });

function originAllowed(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  return allowedHostMatchers.some(({ host, wildcardSub }) => {
    if (originHost === host) return true;
    if (wildcardSub && originHost.endsWith("." + host)) return true;
    return false;
  });
}

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (wildcardAllowed) return cb(null, true);
      if (originAllowed(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    // Never echo credentials when wildcard is in effect (prevents CSRF/credential theft)
    credentials: !wildcardAllowed,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Rate limit auth endpoints to slow down credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Zu viele Versuche. Bitte später erneut." },
});

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/restaurant", restaurantRoutes);

// One-shot schema migrations (idempotent). Runs on startup to make sure
// new tables exist even if `prisma db push` could not reach the DB locally.
async function ensureSchema() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "RestaurantSettings" (
        "id" TEXT PRIMARY KEY DEFAULT 'default',
        "name" TEXT NOT NULL DEFAULT 'Tasty',
        "tagline" TEXT,
        "description" TEXT,
        "phone" TEXT,
        "email" TEXT,
        "street" TEXT,
        "postalCode" TEXT,
        "city" TEXT,
        "openingHours" TEXT,
        "social" TEXT,
        "primaryColor" TEXT,
        "logoUrl" TEXT,
        "heroImageUrl" TEXT,
        "deliveryEnabled" BOOLEAN NOT NULL DEFAULT true,
        "pickupEnabled" BOOLEAN NOT NULL DEFAULT true,
        "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 3.5,
        "freeDeliveryThreshold" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
        "allowedPostalPrefixes" TEXT NOT NULL DEFAULT '34',
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("[migrate] RestaurantSettings table ensured");
  } catch (e) {
    console.error("[migrate] failed to ensure schema", e);
  }
}

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT} (${config.nodeEnv})`
  );
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🌐 CORS allowed: ${allowedOrigins.join(", ")}`);
  ensureSchema();
});

export default app;
