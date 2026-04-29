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
  couponCode: z.string().min(1).max(60).optional(),
  deliveryAddress: z
    .object({
      street: z.string().min(2).max(120),
      postalCode: z.string().min(4).max(10),
      city: z.string().min(2).max(80),
      country: z.string().min(2).max(60).optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(200),
        quantity: z.number().int().min(1).max(50),
        notes: z.string().max(500).optional(),
      })
    )
    .min(1)
    .max(50),
});
