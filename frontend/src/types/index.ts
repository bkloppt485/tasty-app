export type UserRole = "CUSTOMER" | "ADMIN" | "RESTAURANT_MANAGER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  active: boolean;
  allergens?: string | null;
  ingredients?: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  couponApplied?: string;
}

export type OrderType = "PICKUP" | "DELIVERY";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface Order {
  id: string;
  userId: string;
  orderType: OrderType;
  status: OrderStatus;
  totalAmount: number;
  tipAmount?: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
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
  validUntil: string;
  usageLimit?: number | null;
  usedCount: number;
  isPersonalized: boolean;
  redeemedByMe?: boolean;
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: string;
  userId?: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  partySize: number;
  notes?: string | null;
  status: ReservationStatus;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  orderId?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface RestaurantSettings {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  openingHours?: string | null;
  social?: string | null;
  primaryColor?: string | null;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  allowedPostalPrefixes: string;
  updatedAt: string;
}
