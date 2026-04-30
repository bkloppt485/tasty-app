import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { authMiddleware, adminMiddleware, AuthRequest } from "@/middleware/auth";
import { validateRequest } from "@/middleware/validation";
import {
  sendOrderStatusUpdate,
  sendReservationStatusUpdate,
} from "@/lib/mailer";
import { sendOrderStatusPush } from "@/lib/push";
import {
  createProductSchema,
  updateProductSchema,
  createCouponSchema,
  updateCouponSchema,
  restaurantSettingsSchema,
} from "@/types/schemas";

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

      sendOrderStatusPush({
        userId: order.userId,
        orderId: order.id,
        status,
      }).catch((e) => console.error("[admin] order status push failed:", e));
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

// POST /api/admin/demo-reset — wipe orders, reservations, push subs, redemptions
// to put the demo back into a pristine state for live customer pitches.
// Does NOT touch users, products, coupons.
router.post("/demo-reset", async (_req: AuthRequest, res: Response) => {
  try {
    const [orderItems, addresses, orders, reservations, redemptions, pushSubs] =
      await prisma.$transaction([
        prisma.orderItem.deleteMany(),
        prisma.address.deleteMany({ where: { orderId: { not: null } } }),
        prisma.order.deleteMany(),
        prisma.reservation.deleteMany(),
        prisma.couponRedemption.deleteMany(),
        prisma.pushSubscription.deleteMany(),
      ]);

    // Reset coupon usage counters
    await prisma.coupon.updateMany({ data: { usedCount: 0 } });

    res.json({
      ok: true,
      deleted: {
        orderItems: orderItems.count,
        addresses: addresses.count,
        orders: orders.count,
        reservations: reservations.count,
        redemptions: redemptions.count,
        pushSubscriptions: pushSubs.count,
      },
    });
  } catch (e) {
    console.error("Demo reset failed", e);
    res.status(500).json({ error: "Demo reset failed" });
  }
});

// ─── PRODUCTS CRUD ──────────────────────────────────────────────
router.get("/products", async (_req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    res.json(products);
  } catch (e) {
    console.error("[admin] list products failed", e);
    res.status(500).json({ error: "Failed to list products" });
  }
});

const productBodySchema = z.object({ body: createProductSchema });
const productUpdateBodySchema = z.object({ body: updateProductSchema });

router.post(
  "/products",
  validateRequest(productBodySchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body as z.infer<typeof createProductSchema>;
      const product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image: data.image || null,
          allergens: data.allergens || null,
          ingredients: data.ingredients || null,
          active: data.active ?? true,
        },
      });
      res.status(201).json(product);
    } catch (e) {
      console.error("[admin] create product failed", e);
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

router.patch(
  "/products/:id",
  validateRequest(productUpdateBodySchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body as z.infer<typeof updateProductSchema>;
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.image !== undefined && { image: data.image || null }),
          ...(data.allergens !== undefined && { allergens: data.allergens || null }),
          ...(data.ingredients !== undefined && { ingredients: data.ingredients || null }),
          ...(data.active !== undefined && { active: data.active }),
        },
      });
      res.json(product);
    } catch (e) {
      console.error("[admin] update product failed", e);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
);

router.delete("/products/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    // Check if product is referenced — soft-delete (set active=false) if so
    const itemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (itemCount > 0) {
      const product = await prisma.product.update({
        where: { id },
        data: { active: false },
      });
      return res.json({ ok: true, softDeleted: true, product });
    }
    await prisma.product.delete({ where: { id } });
    res.json({ ok: true, deleted: true });
  } catch (e) {
    console.error("[admin] delete product failed", e);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ─── COUPONS CRUD ──────────────────────────────────────────────
router.get("/coupons", async (_req: AuthRequest, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(coupons);
  } catch (e) {
    console.error("[admin] list coupons failed", e);
    res.status(500).json({ error: "Failed to list coupons" });
  }
});

const couponBodySchema = z.object({ body: createCouponSchema });
const couponUpdateBodySchema = z.object({ body: updateCouponSchema });

router.post(
  "/coupons",
  validateRequest(couponBodySchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body as z.infer<typeof createCouponSchema>;
      const coupon = await prisma.coupon.create({
        data: {
          code: data.code.toUpperCase(),
          title: data.title,
          subtitle: data.subtitle,
          imageUrl: data.imageUrl || null,
          discountText: data.discountText,
          discountType: data.discountType,
          discountValue: data.discountValue,
          minOrderValue: data.minOrderValue ?? null,
          validUntil: new Date(data.validUntil),
          usageLimit: data.usageLimit ?? null,
          isPersonalized: data.isPersonalized ?? true,
        },
      });
      res.status(201).json(coupon);
    } catch (e: unknown) {
      console.error("[admin] create coupon failed", e);
      const err = e as { code?: string };
      if (err?.code === "P2002") {
        return res.status(400).json({ error: "Coupon-Code existiert bereits" });
      }
      res.status(500).json({ error: "Failed to create coupon" });
    }
  }
);

router.patch(
  "/coupons/:id",
  validateRequest(couponUpdateBodySchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body as z.infer<typeof updateCouponSchema>;
      const coupon = await prisma.coupon.update({
        where: { id },
        data: {
          ...(data.code !== undefined && { code: data.code.toUpperCase() }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
          ...(data.discountText !== undefined && { discountText: data.discountText }),
          ...(data.discountType !== undefined && { discountType: data.discountType }),
          ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
          ...(data.minOrderValue !== undefined && { minOrderValue: data.minOrderValue ?? null }),
          ...(data.validUntil !== undefined && { validUntil: new Date(data.validUntil) }),
          ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit ?? null }),
          ...(data.isPersonalized !== undefined && { isPersonalized: data.isPersonalized }),
        },
      });
      res.json(coupon);
    } catch (e) {
      console.error("[admin] update coupon failed", e);
      res.status(500).json({ error: "Failed to update coupon" });
    }
  }
);

router.delete("/coupons/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.couponRedemption.deleteMany({ where: { couponId: id } });
    await prisma.coupon.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error("[admin] delete coupon failed", e);
    res.status(500).json({ error: "Failed to delete coupon" });
  }
});

// ─── RESTAURANT SETTINGS ──────────────────────────────────────────────
const settingsBodySchema = z.object({ body: restaurantSettingsSchema });

router.put(
  "/restaurant",
  validateRequest(settingsBodySchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body as z.infer<typeof restaurantSettingsSchema>;
      const cleaned = Object.fromEntries(
        Object.entries(data).map(([k, v]) =>
          v === "" && (k === "logoUrl" || k === "heroImageUrl" || k === "email")
            ? [k, null]
            : [k, v]
        )
      );
      const settings = await prisma.restaurantSettings.upsert({
        where: { id: "default" },
        update: cleaned,
        create: { id: "default", ...cleaned },
      });
      res.json(settings);
    } catch (e) {
      console.error("[admin] update restaurant failed", e);
      res.status(500).json({ error: "Failed to update settings" });
    }
  }
);

export default router;
