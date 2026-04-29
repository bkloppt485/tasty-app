import { Router, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { authMiddleware, AuthRequest } from "@/middleware/auth";
import { verifyToken } from "@/utils/jwt";

const router = Router();

function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    }
  } catch {
    /* ignore invalid token */
  }
  next();
}

// List active coupons. If authenticated, mark redeemedByMe.
router.get("/", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { validUntil: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    let redeemedIds = new Set<string>();
    if (req.userId) {
      const redemptions = await prisma.couponRedemption.findMany({
        where: { userId: req.userId },
        select: { couponId: true },
      });
      redeemedIds = new Set(redemptions.map((r) => r.couponId));
    }

    res.json(
      coupons.map((c) => ({
        ...c,
        redeemedByMe: redeemedIds.has(c.id),
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
});

// Activate a coupon for current user (one-time per user)
router.post(
  "/:id/redeem",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const couponId = req.params.id;
      const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
      if (!coupon) {
        return res.status(404).json({ error: "Angebot nicht gefunden" });
      }
      if (coupon.validUntil <= new Date()) {
        return res.status(400).json({ error: "Angebot abgelaufen" });
      }
      const existing = await prisma.couponRedemption.findUnique({
        where: { userId_couponId: { userId: req.userId!, couponId } },
      });
      if (existing) {
        return res.status(409).json({ error: "Bereits aktiviert" });
      }
      await prisma.couponRedemption.create({
        data: { userId: req.userId!, couponId },
      });
      res.json({ ...coupon, redeemedByMe: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to redeem coupon" });
    }
  }
);

// Deactivate a coupon (only if not yet attached to an order)
router.delete(
  "/:id/redeem",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const couponId = req.params.id;
      const existing = await prisma.couponRedemption.findUnique({
        where: { userId_couponId: { userId: req.userId!, couponId } },
      });
      if (!existing) {
        return res.status(404).json({ error: "Nicht aktiviert" });
      }
      if (existing.orderId) {
        return res
          .status(400)
          .json({ error: "Bereits in einer Bestellung verwendet" });
      }
      await prisma.couponRedemption.delete({ where: { id: existing.id } });
      const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
      res.json({ ...coupon, redeemedByMe: false });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to remove redemption" });
    }
  }
);

export default router;
