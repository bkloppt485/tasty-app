import { Router, Response } from "express";
import { prisma } from "@/database/prisma";
import { hashPassword, comparePasswords } from "@/utils/password";
import { generateToken } from "@/utils/jwt";
import { validateRequest } from "@/middleware/validation";
import { registerSchema, loginSchema } from "@/types/schemas";
import { authMiddleware, AuthRequest } from "@/middleware/auth";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "CUSTOMER",
        },
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

router.post(
  "/login",
  validateRequest(loginSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatch = await comparePasswords(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  }
);

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
