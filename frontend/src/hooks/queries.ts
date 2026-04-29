import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product, Coupon, Order, User, Reservation } from "@/types";
import { useAuthStore } from "@/store/auth";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => (await api.get<Product[]>("/products")).data,
  });
}

export function useCoupons() {
  return useQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: async () => (await api.get<Coupon[]>("/coupons")).data,
  });
}

export function useRedeemCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (couponId: string) => {
      const res = await api.post<Coupon>(`/coupons/${couponId}/redeem`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useUnredeemCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (couponId: string) => {
      const res = await api.delete<Coupon>(`/coupons/${couponId}/redeem`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useOrders() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => (await api.get<Order[]>("/orders")).data,
    enabled: isAuthenticated,
    // Live status: poll every 10s if there is at least one active order
    refetchInterval: (q) => {
      const orders = q.state.data as Order[] | undefined;
      if (!orders) return false;
      const hasActive = orders.some(
        (o) =>
          o.status === "CONFIRMED" ||
          o.status === "PREPARING" ||
          o.status === "PENDING",
      );
      return hasActive ? 10_000 : false;
    },
    refetchOnWindowFocus: true,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post<{ user: User; token: string }>(
        "/auth/login",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      // Refetch user-scoped queries with the new auth token
      qc.invalidateQueries({ queryKey: ["coupons"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["reservations", "me"] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const res = await api.post<{ user: User; token: string }>(
        "/auth/register",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["coupons"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["reservations", "me"] });
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      orderType: "PICKUP" | "DELIVERY";
      tipAmount?: number;
      items: { productId: string; quantity: number; notes?: string }[];
    }) => {
      const res = await api.post<Order>("/orders", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export interface CreateReservationInput {
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  date: string;
  partySize: number;
  notes?: string;
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReservationInput) => {
      const res = await api.post<Reservation>("/reservations", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations", "me"] }),
  });
}

export function useMyReservations() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery<Reservation[]>({
    queryKey: ["reservations", "me"],
    queryFn: async () =>
      (await api.get<Reservation[]>("/reservations/me")).data,
    enabled: isAuthenticated,
  });
}

