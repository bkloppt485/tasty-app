import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  if (isProduction) {
    throw new Error(
      "JWT_SECRET must be set to a strong value (>=32 chars) in production"
    );
  }
  if (!jwtSecret) {
    console.warn(
      "⚠️  JWT_SECRET not set — using insecure dev default. Do NOT use in production."
    );
  }
}

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: jwtSecret || "dev-only-insecure-secret-do-not-use-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction,
};

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}
