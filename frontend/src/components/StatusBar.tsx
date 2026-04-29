"use client";

import { useEffect, useState } from "react";

const OPEN_HOUR = 11;
const CLOSE_HOUR = 22;

function getStatus(now: Date) {
  const h = now.getHours();
  const open = h >= OPEN_HOUR && h < CLOSE_HOUR;
  return {
    open,
    label: open
      ? `Jetzt geöffnet · ${OPEN_HOUR}:00 – ${CLOSE_HOUR}:00`
      : `Geschlossen · öffnet wieder um ${OPEN_HOUR}:00`,
  };
}

export default function StatusBar() {
  const [status, setStatus] = useState(() => getStatus(new Date()));

  useEffect(() => {
    const update = () => setStatus(getStatus(new Date()));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full bg-bg-primary border-b border-border-subtle"
      role="status"
      aria-label={status.label}
    >
      <div className="px-6 py-1.5 flex items-center justify-center gap-2.5">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            status.open ? "bg-accent-gold" : "bg-text-faint"
          }`}
        />
        <span className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
          {status.label}
        </span>
      </div>
    </div>
  );
}
