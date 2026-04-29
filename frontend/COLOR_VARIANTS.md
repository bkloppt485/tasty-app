# Tasty-App: Farbpaletten-Varianten zum Testen

## Original-Config
**tailwind.config.cjs** - Bordeaux-basiert
- Hintergrund: Bordeaux (#2D0A0F)
- Accent: Gold (#D4A574)
- Text: Cream (#F5EDE0)
- Problem: Zu dunkel, Inhalte stechen nicht heraus

---

## Variante A: "Helles Cream" 🟡
**tailwind.config.variant-a.cjs**
- Haupthintergrund: Cream (#F5EDE0)
- Bordeaux nur für Header & Akzente
- Text: Dunkle Schrift auf hellem Grund
- Ziel: Maximum Lesbarkeit & Helligkeit

### Farben:
```
bg.primary: #F5EDE0 (Cream - Hintergrund)
bg.deep: #EAE0D3 (Dunkleres Cream)
bg.elevated: #FFF9F3 (Noch heller)
accent.gold: #2D0A0F (Bordeaux - jetzt Akzent!)
text.cream: #2D0A0F (Dunkel - für Text auf hellem Grund)
```

---

## Variante B: "Modernes Grau" ⚫
**tailwind.config.variant-b.cjs**
- Basis: Leichtes Grau (#F8F8F8)
- Bordeaux + Gold = Akzente
- Modern & minimalistisch
- Ziel: Neutral, professionell

### Farben:
```
bg.primary: #F8F8F8 (Leichtes Grau)
bg.deep: #E8E8E8 (Dunkleres Grau)
bg.elevated: #FFFFFF (Weiß)
accent.gold: #D4A574 (Gold bleibt)
text.cream: #2D0A0F (Bordeaux für Text)
```

---

## Variante C: "Warmes Beige" 🧡
**tailwind.config.variant-c.cjs**
- Basis: Warm Beige (#FAF5F0)
- Bordeaux + Gold klassisch
- Ziel: Warm & elegant, aber nicht zu dunkel

### Farben:
```
bg.primary: #FAF5F0 (Warm Beige)
bg.deep: #F0E8DC (Dunkleres Beige)
bg.elevated: #FFF8F2 (Noch heller)
accent.gold: #D4A574 (Gold)
text.cream: #2D0A0F (Bordeaux für Text)
```

---

## So wird getestet:

1. **Variante A testen:**
   ```bash
   cp frontend/tailwind.config.variant-a.cjs frontend/tailwind.config.cjs
   ```
   Server neustarten oder warten bis Tailwind neuladen → http://localhost:3000

2. **Variante B testen:**
   ```bash
   cp frontend/tailwind.config.variant-b.cjs frontend/tailwind.config.cjs
   ```

3. **Variante C testen:**
   ```bash
   cp frontend/tailwind.config.variant-c.cjs frontend/tailwind.config.cjs
   ```

---

## Zu testen:

- ✅ **Startseite** (Pizza Verinio Hero)
- ✅ **Speisekarten-Tab** (Lesbarkeit)
- ✅ **Coupons/Aufmerksamkeiten** (müssen herausstechen)
- ✅ **Profil-Tab** (Kontrast)

## Feedback:
Nach dem Test: **Welche Variante sieht am besten aus?**
