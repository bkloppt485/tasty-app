import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "@/config/env";
import healthRoutes from "@/routes/health";
import authRoutes from "@/routes/auth";
import productRoutes from "@/routes/products";
import couponRoutes from "@/routes/coupons";
import orderRoutes from "@/routes/orders";
import reservationRoutes from "@/routes/reservations";

const app = express();

// Middleware
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS ?? config.frontendUrl)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes("*")) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      // Allow Vercel preview deployments matching base host
      if (
        allowedOrigins.some(
          (o) =>
            o.startsWith("https://") &&
            origin.endsWith(o.replace(/^https?:\/\//, "").replace(/^\*\./, ""))
        )
      ) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);

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
});

export default app;
