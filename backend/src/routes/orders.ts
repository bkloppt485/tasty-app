import { Router, Response } from "express";
import { prisma } from "@/database/prisma";
import { authMiddleware, AuthRequest } from "@/middleware/auth";
import { validateRequest } from "@/middleware/validation";
import { createOrderSchema } from "@/types/schemas";

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
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  }
);

export default router;
