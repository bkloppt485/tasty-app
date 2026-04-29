export interface Greeting {
  text: string;
  emoji: string;
  accent: "morning" | "noon" | "afternoon" | "evening" | "night";
}

export function getGreeting(now: Date = new Date(), name?: string): Greeting {
  const h = now.getHours();
  const who = name ? `, ${name.split(" ")[0]}` : "";
  if (h >= 6 && h < 11) {
    return { text: `Guten Morgen${who}`, emoji: "☀️", accent: "morning" };
  }
  if (h >= 11 && h < 14) {
    return { text: `Mahlzeit${who}!`, emoji: "🍽️", accent: "noon" };
  }
  if (h >= 14 && h < 17) {
    return { text: `Lust auf Snack${who}?`, emoji: "☕", accent: "afternoon" };
  }
  if (h >= 17 && h < 22) {
    return { text: `Guten Abend${who}`, emoji: "🌙", accent: "evening" };
  }
  return { text: `Späte Stunde${who}`, emoji: "😴", accent: "night" };
}

export function greetingAccentClass(accent: Greeting["accent"]): string {
  switch (accent) {
    case "morning":
      return "from-amber-300 via-orange-400 to-rose-400";
    case "noon":
      return "from-rose-400 via-brand to-brand-dark";
    case "afternoon":
      return "from-orange-300 via-rose-400 to-brand";
    case "evening":
      return "from-orange-400 via-rose-500 to-purple-600";
    case "night":
      return "from-indigo-500 via-purple-600 to-slate-800";
  }
}
