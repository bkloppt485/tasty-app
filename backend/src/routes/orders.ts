import { Router, Response } from "express";
import { prisma } from "@/database/prisma";
import { authMiddleware, AuthRequest } from "@/middleware/auth";
import { validateRequest } from "@/middleware/validation";
import { createOrderSchema } from "@/types/schemas";
import { sendOrderConfirmation } from "@/lib/mailer";
import { sendNewOrderToAdmins } from "@/lib/push";

const router = Router();

// Get all orders for current user
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Create new order
router.post(
  "/",
  authMiddleware,
  validateRequest(createOrderSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { orderType, items, tipAmount = 0 } = req.body as {
        orderType: "PICKUP" | "DELIVERY";
        items: { productId: string; quantity: number; notes?: string }[];
        tipAmount?: number;
      };

      const productIds = items.map((i) => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== items.length) {
        return res.status(400).json({ error: "Invalid products in order" });
      }

      const subtotal = items.reduce((sum, item) => {
        const p = products.find((x) => x.id === item.productId)!;
        return sum + p.price * item.quantity;
      }, 0);
      const totalAmount = subtotal + (tipAmount || 0);

      const order = await prisma.order.create({
        data: {
          userId: req.userId!,
          orderType,
          status: "CONFIRMED",
          totalAmount,
          tipAmount: tipAmount || 0,
          items: {
            create: items.map((item) => {
              const p = products.find((x) => x.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: p.price,
              };
            }),
          },
        },
        include: { items: { include: { product: true } } },
      });

      res.status(201).json(order);

      // Fire-and-forget: send confirmation email to user
      const user = await prisma.user.findUnique({ where: { id: req.userId! } });
      if (user?.email) {
        sendOrderConfirmation({
          to: user.email,
          name: user.name,
          orderId: order.id,
          orderType: order.orderType as "PICKUP" | "DELIVERY",
          totalAmount: order.totalAmount,
          tipAmount: order.tipAmount,
          items: order.items.map((it) => ({
            quantity: it.quantity,
            price: it.price,
            product: { name: it.product.name },
          })),
        }).catch((e) => console.error("[orders] confirmation mail failed:", e));
      }

      // Fire-and-forget: notify admins via push
      sendNewOrderToAdmins({
        orderId: order.id,
        totalAmount: order.totalAmount,
        customerName: user?.name ?? "Gast",
        orderType: order.orderType,
      }).catch((e) => console.error("[orders] admin push failed:", e));
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  }
);

// Get single order (own order only, used for live status polling)
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.userId !== req.userId && req.userRole !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
