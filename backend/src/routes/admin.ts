import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { authMiddleware, adminMiddleware, AuthRequest } from "@/middleware/auth";
import { validateRequest } from "@/middleware/validation";
import {
  sendOrderStatusUpdate,
  sendReservationStatusUpdate,
} from "@/lib/mailer";

const router = Router();

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;

const RESERVATION_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"] as const;

const orderStatusSchema = z.object({
  body: z.object({
    status: z.enum(ORDER_STATUSES),
  }),
});

const reservationStatusSchema = z.object({
  body: z.object({
    status: z.enum(RESERVATION_STATUSES),
  }),
});

router.use(authMiddleware, adminMiddleware);

// GET /api/admin/orders?status=&limit=&cursor=
router.get("/orders", async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const limit = Math.min(parseInt((req.query.limit as string) || "50", 10), 100);
    const where = status && (ORDER_STATUSES as readonly string[]).includes(status)
      ? { status }
      : undefined;
    const orders = await prisma.order.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
        addresses: true,
      },
    });
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch(
  "/orders/:id/status",
  validateRequest(orderStatusSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: string };
      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });
      res.json(order);

      if (order.user?.email) {
        sendOrderStatusUpdate({
          to: order.user.email,
          name: order.user.name,
          orderId: order.id,
          status,
        }).catch((e) =>
          console.error("[admin] order status mail failed:", e),
        );
      }
    } catch (e: any) {
      if (e?.code === "P2025") {
        return res.status(404).json({ error: "Order not found" });
      }
      console.error(e);
      res.status(500).json({ error: "Failed to update order" });
    }
  },
);

// GET /api/admin/reservations?status=&date=YYYY-MM-DD&limit=
router.get("/reservations", async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const dateStr = req.query.date as string | undefined;
    const limit = Math.min(parseInt((req.query.limit as string) || "100", 10), 200);

    const where: any = {};
    if (status && (RESERVATION_STATUSES as readonly string[]).includes(status)) {
      where.status = status;
    }
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const dayStart = new Date(d);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        where.date = { gte: dayStart, lt: dayEnd };
      }
    }

    const reservations = await prisma.reservation.findMany({
      where,
      take: limit,
      orderBy: { date: "asc" },
    });
    res.json(reservations);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

router.patch(
  "/reservations/:id/status",
  validateRequest(reservationStatusSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: string };
      const reservation = await prisma.reservation.update({
        where: { id },
        data: { status },
      });
      res.json(reservation);

      if (reservation.guestEmail) {
        sendReservationStatusUpdate({
          to: reservation.guestEmail,
          name: reservation.guestName,
          reservationId: reservation.id,
          status,
          date: reservation.date,
          partySize: reservation.partySize,
        }).catch((e) =>
          console.error("[admin] reservation status mail failed:", e),
        );
      }
    } catch (e: any) {
      if (e?.code === "P2025") {
        return res.status(404).json({ error: "Reservation not found" });
      }
      console.error(e);
      res.status(500).json({ error: "Failed to update reservation" });
    }
  },
);

// GET /api/admin/stats — today's overview
router.get("/stats", async (_req: AuthRequest, res: Response) => {
  try {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    const [todaysOrders, activeOrders, todaysReservations, pendingReservations] =
      await Promise.all([
        prisma.order.findMany({
          where: { createdAt: { gte: dayStart } },
          select: { totalAmount: true, status: true },
        }),
        prisma.order.count({
          where: { status: { in: ["CONFIRMED", "PREPARING", "READY"] } },
        }),
        prisma.reservation.count({
          where: { date: { gte: dayStart } },
        }),
        prisma.reservation.count({ where: { status: "PENDING" } }),
      ]);

    const todayRevenue = todaysOrders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((s, o) => s + o.totalAmount, 0);

    res.json({
      todayOrders: todaysOrders.length,
      todayRevenue,
      activeOrders,
      todayReservations: todaysReservations,
      pendingReservations,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
