import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { authMiddleware, AuthRequest } from "@/middleware/auth";
import { PUSH_PUBLIC_KEY } from "@/lib/push";

const router = Router();

router.get("/vapid-key", (_req, res: Response) => {
  res.json({ publicKey: PUSH_PUBLIC_KEY });
});

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(10),
    auth: z.string().min(10),
  }),
  userAgent: z.string().optional(),
});

router.post("/subscribe", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid subscription" });
    }
    const { endpoint, keys, userAgent } = parsed.data;
    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        userId: req.userId!,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent,
      },
      update: {
        userId: req.userId!,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent,
      },
    });
    res.status(201).json({ id: sub.id });
  } catch (e) {
    console.error("[push/subscribe]", e);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

router.delete("/subscribe", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const endpoint = (req.body?.endpoint as string | undefined) ?? undefined;
    if (!endpoint) return res.status(400).json({ error: "endpoint required" });
    await prisma.pushSubscription
      .delete({ where: { endpoint } })
      .catch(() => undefined);
    res.json({ ok: true });
  } catch (e) {
    console.error("[push/unsubscribe]", e);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
});

export default router;
