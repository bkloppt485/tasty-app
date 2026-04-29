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
const DELIVERY_FEE = 3.5;
const FREE_DELIVERY_THRESHOLD = 25.0;
const ALLOWED_POSTAL_PREFIXES = ["34"]; // Kassel area

router.post(
  "/",
  authMiddleware,
  validateRequest(createOrderSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        orderType,
        items,
        tipAmount = 0,
        couponCode,
        deliveryAddress,
      } = req.body as {
        orderType: "PICKUP" | "DELIVERY";
        items: { productId: string; quantity: number; notes?: string }[];
        tipAmount?: number;
        couponCode?: string;
        deliveryAddress?: {
          street: string;
          postalCode: string;
          city: string;
          country?: string;
        };
      };

      // Delivery → require address with allowed postal code
      if (orderType === "DELIVERY") {
        if (!deliveryAddress) {
          return res
            .status(400)
            .json({ error: "Lieferadresse erforderlich" });
        }
        const plz = deliveryAddress.postalCode.replace(/\s+/g, "");
        if (!ALLOWED_POSTAL_PREFIXES.some((p) => plz.startsWith(p))) {
          return res.status(400).json({
            error:
              "Wir liefern aktuell nur in den Raum Kassel (PLZ beginnend mit 34).",
          });
        }
      }

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

      // Coupon
      let discountAmount = 0;
      let appliedCouponCode: string | null = null;
      let couponRecord: { id: string; code: string } | null = null;

      if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });
        if (!coupon) {
          return res.status(400).json({ error: "Coupon-Code ungültig" });
        }
        if (coupon.validUntil <= new Date()) {
          return res.status(400).json({ error: "Coupon ist abgelaufen" });
        }
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return res.status(400).json({
            error: `Mindestbestellwert ${coupon.minOrderValue.toFixed(2)} € nicht erreicht`,
          });
        }
        if (
          coupon.usageLimit !== null &&
          coupon.usageLimit !== undefined &&
          coupon.usedCount >= coupon.usageLimit
        ) {
          return res.status(400).json({ error: "Coupon nicht mehr verfügbar" });
        }

        if (coupon.discountType === "PERCENT") {
          discountAmount = +(subtotal * (coupon.discountValue / 100)).toFixed(2);
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
        appliedCouponCode = coupon.code;
        couponRecord = { id: coupon.id, code: coupon.code };
      }

      const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
      const deliveryFee =
        orderType === "DELIVERY" && subtotalAfterDiscount < FREE_DELIVERY_THRESHOLD
          ? DELIVERY_FEE
          : 0;
      const totalAmount = subtotalAfterDiscount + deliveryFee + (tipAmount || 0);

      const order = await prisma.order.create({
        data: {
          userId: req.userId!,
          orderType,
          status: "CONFIRMED",
          totalAmount,
          tipAmount: tipAmount || 0,
          discountAmount,
          deliveryFee,
          couponCode: appliedCouponCode,
          items: {
            create: items.map((item) => {
              const p = products.find((x) => x.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: p.price,
                couponApplied: appliedCouponCode ?? undefined,
              };
            }),
          },
          ...(orderType === "DELIVERY" && deliveryAddress
            ? {
                addresses: {
                  create: [
                    {
                      userId: req.userId!,
                      street: deliveryAddress.street,
                      city: deliveryAddress.city,
                      postalCode: deliveryAddress.postalCode,
                      country: deliveryAddress.country || "Deutschland",
                    },
                  ],
                },
              }
            : {}),
        },
        include: {
          items: { include: { product: true } },
          addresses: true,
        },
      });

      // Mark coupon redemption + bump usage atomically (best-effort)
      if (couponRecord) {
        await prisma
          .$transaction([
            prisma.coupon.update({
              where: { id: couponRecord.id },
              data: { usedCount: { increment: 1 } },
            }),
            prisma.couponRedemption.upsert({
              where: {
                userId_couponId: {
                  userId: req.userId!,
                  couponId: couponRecord.id,
                },
              },
              update: { orderId: order.id },
              create: {
                userId: req.userId!,
                couponId: couponRecord.id,
                orderId: order.id,
              },
            }),
          ])
          .catch((e) => console.error("[orders] coupon bookkeeping failed:", e));
      }

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
      console.error("[orders] create failed", error);
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
