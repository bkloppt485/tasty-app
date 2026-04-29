import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Order, OrderStatus, Reservation, ReservationStatus } from "@/types";

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
