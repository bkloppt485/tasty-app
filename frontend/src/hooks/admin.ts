import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  Order,
  OrderStatus,
  Reservation,
  ReservationStatus,
  Product,
  Coupon,
  RestaurantSettings,
} from "@/types";

export interface AdminOrder extends Order {
  user?: { id: string; name: string; email: string };
}

export interface AdminStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  todayReservations: number;
  pendingReservations: number;
}

export function useAdminOrders(status?: OrderStatus | "ALL") {
  return useQuery<AdminOrder[]>({
    queryKey: ["admin", "orders", status ?? "ALL"],
    queryFn: async () => {
      const q = status && status !== "ALL" ? `?status=${status}` : "";
      const res = await api.get<AdminOrder[]>(`/admin/orders${q}`);
      return res.data;
    },
    refetchInterval: 8000,
  });
}

export function useAdminReservations(status?: ReservationStatus | "ALL") {
  return useQuery<Reservation[]>({
    queryKey: ["admin", "reservations", status ?? "ALL"],
    queryFn: async () => {
      const q = status && status !== "ALL" ? `?status=${status}` : "";
      const res = await api.get<Reservation[]>(`/admin/reservations${q}`);
      return res.data;
    },
    refetchInterval: 12000,
  });
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => (await api.get<AdminStats>("/admin/stats")).data,
    refetchInterval: 15000,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const res = await api.patch<AdminOrder>(`/admin/orders/${id}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateReservationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ReservationStatus;
    }) => {
      const res = await api.patch<Reservation>(
        `/admin/reservations/${id}/status`,
        { status },
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reservations"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["reservations", "me"] });
    },
  });
}

export function useDemoReset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<{ ok: boolean; deleted: Record<string, number> }>(
        "/admin/demo-reset",
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["reservations"] });
      qc.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

// ───── Products CRUD ─────
export function useAdminProducts() {
  return useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => (await api.get<Product[]>("/admin/products")).data,
  });
}

export type ProductInput = {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  allergens?: string;
  ingredients?: string;
  active?: boolean;
};

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProductInput) =>
      (await api.post<Product>("/admin/products", data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductInput> }) =>
      (await api.patch<Product>(`/admin/products/${id}`, data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await api.delete(`/admin/products/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ───── Coupons CRUD ─────
export function useAdminCoupons() {
  return useQuery<Coupon[]>({
    queryKey: ["admin", "coupons"],
    queryFn: async () => (await api.get<Coupon[]>("/admin/coupons")).data,
  });
}

export type CouponInput = {
  code: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  discountText: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderValue?: number | null;
  validUntil: string;
  usageLimit?: number | null;
  isPersonalized?: boolean;
};

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CouponInput) =>
      (await api.post<Coupon>("/admin/coupons", data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      qc.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CouponInput> }) =>
      (await api.patch<Coupon>(`/admin/coupons/${id}`, data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      qc.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await api.delete(`/admin/coupons/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      qc.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

// ───── Restaurant Settings ─────
export function useRestaurantSettings() {
  return useQuery<RestaurantSettings>({
    queryKey: ["restaurant", "settings"],
    queryFn: async () =>
      (await api.get<RestaurantSettings>("/restaurant")).data,
    staleTime: 60_000,
  });
}

export function useUpdateRestaurantSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<RestaurantSettings>) =>
      (await api.put<RestaurantSettings>("/admin/restaurant", data)).data,
    onSuccess: (data) => {
      qc.setQueryData(["restaurant", "settings"], data);
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    },
  });
}
