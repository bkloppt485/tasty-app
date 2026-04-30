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
  name: z.string().min(1, "Product name is required").max(120),
  description: z.string().max(2000).optional(),
  price: z.number().positive("Price must be positive").max(9999),
  category: z.string().min(1, "Category is required").max(60),
  image: z.string().url().optional().or(z.literal("")),
  allergens: z.string().max(500).optional(),
  ingredients: z.string().max(2000).optional(),
  active: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCouponSchema = z.object({
  code: z.string().min(2).max(60),
  title: z.string().min(2).max(120),
  subtitle: z.string().min(2).max(200),
  imageUrl: z.string().url().optional().or(z.literal("")),
  discountText: z.string().min(1).max(40),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.number().positive().max(100),
  minOrderValue: z.number().min(0).max(9999).optional().nullable(),
  validUntil: z.string().min(1),
  usageLimit: z.number().int().positive().max(100000).optional().nullable(),
  isPersonalized: z.boolean().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();

export const restaurantSettingsSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  phone: z.string().max(40).optional(),
  email: z.string().email().optional().or(z.literal("")),
  street: z.string().max(120).optional(),
  postalCode: z.string().max(10).optional(),
  city: z.string().max(80).optional(),
  openingHours: z.string().max(2000).optional(),
  social: z.string().max(2000).optional(),
  primaryColor: z.string().max(20).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  deliveryEnabled: z.boolean().optional(),
  pickupEnabled: z.boolean().optional(),
  deliveryFee: z.number().min(0).max(99).optional(),
  freeDeliveryThreshold: z.number().min(0).max(999).optional(),
  allowedPostalPrefixes: z.string().max(200).optional(),
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
