import { Router, Response, Request } from "express";
import { prisma } from "@/database/prisma";

const router = Router();

const DEFAULT_ID = "default";

// Public: get restaurant settings
router.get("/", async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.restaurantSettings.findUnique({
      where: { id: DEFAULT_ID },
    });
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: { id: DEFAULT_ID },
      });
    }
    res.json(settings);
  } catch (e) {
    console.error("[restaurant] get failed", e);
    res.status(500).json({ error: "Failed to load restaurant settings" });
  }
});

export default router;
