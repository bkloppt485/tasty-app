import { Router, Response } from "express";
import { prisma } from "@/database/prisma";
import { validateRequest } from "@/middleware/validation";
import { createProductSchema } from "@/types/schemas";
import { authMiddleware, adminMiddleware, AuthRequest } from "@/middleware/auth";

const router = Router();

// Get all products
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create product (Admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateRequest(createProductSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, description, price, category, image } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          category,
          image,
        },
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

// Get product by ID
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
