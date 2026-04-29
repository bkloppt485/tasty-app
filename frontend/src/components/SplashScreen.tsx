"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 2200);
    const doneTimer = setTimeout(onDone, 2800);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bordeaux text-bg-primary overflow-hidden transition-opacity duration-700 ease-out ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center animate-splash-in">
        <h1
          className="font-script text-accent-gold leading-none"
          style={{ fontSize: "5.5rem" }}
        >
          Tasty
        </h1>
        <div
          className="mt-6 h-px w-24 bg-accent-gold/60 origin-center animate-rule-in"
          aria-hidden
        />
        <p className="mt-5 text-[10px] uppercase tracking-[0.4em] text-bg-primary/60 font-light">
          Est. 2024 · Kassel
        </p>
      </div>
    </div>
  );
}
