import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}
