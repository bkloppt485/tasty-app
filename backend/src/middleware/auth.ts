import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
