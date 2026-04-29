import { Router, Request, Response } from "express";

const router = Router();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

export default router;
