import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url().optional(),
});

export const createOrderSchema = z.object({
  orderType: z.enum(["PICKUP", "DELIVERY"]),
  tipAmount: z.number().min(0).max(1000).optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      notes: z.string().max(500).optional(),
    })
  ),
});
