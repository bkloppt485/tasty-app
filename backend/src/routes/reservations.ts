import { Router, Response, Request, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { authMiddleware, AuthRequest } from "@/middleware/auth";
import { verifyToken } from "@/utils/jwt";

const router = Router();

const createReservationSchema = z.object({
  guestName: z.string().min(2).optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().min(4).optional(),
  date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "Invalid date",
  }),
  partySize: z.number().int().min(1).max(12),
  notes: z.string().max(500).optional(),
});

// Optional auth: attach userId if token is valid, otherwise continue
function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    }
  } catch {
    /* ignore invalid token for optional auth */
  }
  next();
}

router.post("/", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createReservationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: parsed.error.errors });
    }
    const data = parsed.data;
    const date = new Date(data.date);

    if (date.getTime() <= Date.now()) {
      return res.status(400).json({ error: "Datum muss in der Zukunft liegen" });
    }
    const hour = date.getHours();
    const minute = date.getMinutes();
    const totalMin = hour * 60 + minute;
    if (totalMin < 11 * 60 || totalMin > 21 * 60 + 30) {
      return res
        .status(400)
        .json({ error: "Reservierungen nur zwischen 11:00 und 21:30" });
    }

    let guestName = data.guestName;
    let guestEmail = data.guestEmail;
    let guestPhone = data.guestPhone;

    if (req.userId) {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (user) {
        guestName ||= user.name;
        guestEmail ||= user.email;
      }
    }

    if (!guestName || !guestEmail || !guestPhone) {
      return res
        .status(400)
        .json({ error: "Name, E-Mail und Telefon sind erforderlich" });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: req.userId ?? null,
        guestName,
        guestEmail,
        guestPhone,
        date,
        partySize: data.partySize,
        notes: data.notes ?? null,
        status: "CONFIRMED",
      },
    });
    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

router.get(
  "/me",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const reservations = await prisma.reservation.findMany({
        where: { userId: req.userId },
        orderBy: { date: "desc" },
      });
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  }
);

export default router;
