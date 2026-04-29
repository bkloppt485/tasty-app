export interface User {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN" | "RESTAURANT_MANAGER";
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  orderType: "PICKUP" | "DELIVERY";
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  discountText: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderValue?: number | null;
  validUntil: Date;
  usageLimit?: number | null;
  usedCount: number;
  isPersonalized: boolean;
  createdAt: Date;
}
