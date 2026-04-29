"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) arr[i] = rawData.charCodeAt(i);
  return arr;
}

type Status = "idle" | "loading" | "subscribed" | "denied" | "unsupported";

export function usePushSubscription() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  const refresh = useCallback(async () => {
    if (!supported) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? "subscribed" : "idle");
    } catch {
      setStatus("idle");
    }
  }, [supported]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const subscribe = useCallback(async () => {
    if (!supported || !isAuthenticated) return;
    setError(null);
    setStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "idle");
        return;
      }
      const { data } = await api.get<{ publicKey: string }>(
        "/push/vapid-key",
      );
      if (!data.publicKey) {
        setError("Push noch nicht konfiguriert");
        setStatus("idle");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });
      }
      const json = sub.toJSON();
      await api.post("/push/subscribe", {
        endpoint: sub.endpoint,
        keys: {
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
        },
        userAgent: navigator.userAgent,
      });
      setStatus("subscribed");
    } catch (err: unknown) {
      console.error("[push] subscribe failed", err);
      setError("Konnte nicht aktivieren");
      setStatus("idle");
    }
  }, [supported, isAuthenticated]);

  const unsubscribe = useCallback(async () => {
    if (!supported) return;
    setStatus("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await api
          .delete("/push/subscribe", { data: { endpoint: sub.endpoint } })
          .catch(() => undefined);
        await sub.unsubscribe();
      }
      setStatus("idle");
    } catch (err) {
      console.error("[push] unsubscribe failed", err);
      setStatus("idle");
    }
  }, [supported]);

  return { status, error, supported, subscribe, unsubscribe, refresh };
}
