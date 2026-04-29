import jwt from "jsonwebtoken";
import { config } from "@/config/env";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
}
