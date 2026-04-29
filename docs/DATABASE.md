# 📚 Datenbank Dokumentation

## Prisma Setup

Prisma ist ein Modern ORM für Node.js und TypeScript, der Datenbankkommunikation vereinfacht.

### Installation

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

### Konfiguration

**prisma/schema.prisma** - Definiert Datenbankschema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Datenmodelle

### User (Benutzer)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String    // bcrypt hashed
  name      String
  role      UserRole  @default(CUSTOMER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  orders    Order[]
  addresses Address[]
}

enum UserRole {
  CUSTOMER
  ADMIN
  RESTAURANT_MANAGER
}
```

**Beschreibung:**
- Speichert Benutzer-Informationen
- Email ist eindeutig
- Password wird mit bcryptjs gehashed (nicht plaintext!)
- Role bestimmt Zugriffsrechte

**Beispiel-Query:**
```typescript
const user = await prisma.user.create({
  data: {
    email: "john@example.de",
    password: hashedPassword,
    name: "John Doe",
    role: "CUSTOMER"
  }
});
```

---

### Product (Produkt)

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  category    String
  image       String?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  coupons     Coupon[]
  orderItems  OrderItem[]
}
```

**Beschreibung:**
- Speichert Restaurant-Produkte (Gerichte, Getränke)
- Preis in EUR
- Kategorie für Filterung
- Image als URL
- Active Flag für Deaktivierung

**Beispiel-Query:**
```typescript
const products = await prisma.product.findMany({
  where: { 
    active: true,
    category: "Speisen"
  }
});

const product = await prisma.product.create({
  data: {
    name: "Pizza Margherita",
    description: "Klassische Pizza",
    price: 12.99,
    category: "Speisen"
  }
});
```

---

### Order (Bestellung)

```prisma
model Order {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  orderType   OrderType   @default(PICKUP)
  status      OrderStatus @default(PENDING)
  totalAmount Float
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  items       OrderItem[]
  addresses   Address[]
}

enum OrderType {
  PICKUP      // Abhol-Bestellung
  DELIVERY    // Liefer-Bestellung
}

enum OrderStatus {
  PENDING     // Ausstehend
  CONFIRMED   // Bestätigt
  PREPARING   // In Zubereitung
  READY       // Fertig
  COMPLETED   // Abgeschlossen
  CANCELLED   // Storniert
}
```

**Beschreibung:**
- Speichert Kundenbestellungen
- Linked zu User
- OrderType unterscheidet zwischen Pickup und Delivery
- Status zeigt Bestellfortschritt

**Beispiel-Query:**
```typescript
const order = await prisma.order.create({
  data: {
    userId: "user123",
    orderType: "PICKUP",
    status: "PENDING",
    totalAmount: 25.98,
    items: {
      create: [
        {
          productId: "pizza1",
          quantity: 1,
          price: 12.99
        }
      ]
    }
  },
  include: {
    items: {
      include: { product: true }
    }
  }
});

// Order Status aktualisieren
const updated = await prisma.order.update({
  where: { id: "order123" },
  data: { status: "READY" }
});
```

---

### OrderItem (Bestellzeile)

```prisma
model OrderItem {
  id            String @id @default(cuid())
  orderId       String
  order         Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId     String
  product       Product @relation(fields: [productId], references: [id])
  quantity      Int
  price         Float
  couponApplied String?

  @@unique([orderId, productId])
}
```

**Beschreibung:**
- Speichert Produkte innerhalb einer Bestellung
- Quantity ist die Menge
- Price ist der zum Bestellzeitpunkt gültige Preis
- CouponApplied speichert Gutschein-Code

**Unique Constraint:**
- Eine Order kann ein Produkt nur einmal enthalten

**Beispiel:**
```typescript
// Order mit Items erstellen
const item = await prisma.orderItem.create({
  data: {
    orderId: "order123",
    productId: "product456",
    quantity: 2,
    price: 12.99,
    couponApplied: "SAVE10"
  }
});
```

---

### Coupon (Gutschein)

```prisma
model Coupon {
  id            String   @id @default(cuid())
  code          String   @unique
  discountType  String   // "PERCENTAGE" oder "FIXED"
  discountValue Float
  productId     String
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  expiresAt     DateTime
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
}
```

**Beschreibung:**
- Speichert Rabatt-Gutscheine
- Code ist eindeutig
- DiscountType: PERCENTAGE (z.B. 10%) oder FIXED (z.B. 2€)
- Linked zu Product
- ExpiresAt: Ablaufdatum

**Beispiel:**
```typescript
// 10% Rabatt Gutschein
const coupon = await prisma.coupon.create({
  data: {
    code: "SAVE10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    productId: "product123",
    expiresAt: new Date("2024-12-31"),
    active: true
  }
});

// 2€ Rabatt Gutschein
const fixedCoupon = await prisma.coupon.create({
  data: {
    code: "FLAT2",
    discountType: "FIXED",
    discountValue: 2.00,
    productId: "product456",
    expiresAt: new Date("2024-12-31")
  }
});
```

---

### Address (Adresse)

```prisma
model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  orderId    String?
  order      Order?   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  street     String
  city       String
  postalCode String
  country    String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

**Beschreibung:**
- Speichert Lieferadressen
- Kann zu User oder Order gehören
- IsDefault: Standardadresse für Benutzer

**Beispiel:**
```typescript
// Adresse hinzufügen
const address = await prisma.address.create({
  data: {
    userId: "user123",
    street: "Musterstraße 123",
    city: "Berlin",
    postalCode: "10115",
    country: "Deutschland",
    isDefault: true
  }
});

// Standard-Adresse abrufen
const defaultAddress = await prisma.address.findFirst({
  where: {
    userId: "user123",
    isDefault: true
  }
});
```

---

## Migrations

Migrations verfolgen Datenbank-Schema-Änderungen nach.

### Neue Migration erstellen

```bash
cd backend
npx prisma migrate dev --name <name>
```

**Beispiele:**
```bash
# Initial Setup
npx prisma migrate dev --name init

# Neues Feld hinzufügen
npx prisma migrate dev --name add_image_to_product

# Beziehung ändern
npx prisma migrate dev --name update_order_relations
```

### Migrations anwenden

```bash
# Dev
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Datenbank zurücksetzen (⚠️ Achtung!)

```bash
npx prisma migrate reset
# Löscht alle Daten und wendet alle Migrations neu an
```

---

## Seed-Daten

Seed-Daten werden beim Setup automatisch eingefügt.

**Datei:** `backend/prisma/seed.ts`

```bash
npm run db:seed
```

**Was wird eingefügt:**
- 1 Admin User
- 1 Customer User
- 5 Produkte
- 1 Gutschein
- 1 Beispiel-Bestellung
- 1 Adresse

---

## Prisma Studio

Prisma Studio ist eine GUI zum Verwalten von Datenbank-Daten.

```bash
cd backend
npx prisma studio
```

Öffnet: http://localhost:5555

Funktionen:
- Daten anschauen
- Records erstellen/bearbeiten/löschen
- Relationen verwalten
- Queries testen

---

## Best Practices

### 1. Immer mit `include` oder `select` arbeiten

```typescript
// ✅ Gut
const order = await prisma.order.findUnique({
  where: { id: "order123" },
  include: {
    items: {
      include: { product: true }
    },
    user: true
  }
});

// ❌ Schlecht - lädt nur Order, nicht Items
const order = await prisma.order.findUnique({
  where: { id: "order123" }
});
```

### 2. Error Handling

```typescript
try {
  const user = await prisma.user.create({
    data: { email: "test@test.de", ... }
  });
} catch (error) {
  if (error.code === 'P2002') {
    console.log('Email already exists');
  } else {
    console.error('Database error:', error);
  }
}
```

### 3. Transactions für mehrere Operationen

```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  const order = await tx.order.create({
    data: { userId: user.id, ... }
  });
  return { user, order };
});
```

### 4. Pagination

```typescript
const products = await prisma.product.findMany({
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' }
});
```

---

## Häufige Fehler

| Fehler | Lösung |
|--------|--------|
| `PrismaClientValidationError` | Schema.prisma Syntax überprüfen |
| `PrismaClientKnownRequestError` (P2002) | Unique Constraint Violation - Daten schon vorhanden |
| `PrismaClientKnownRequestError` (P2025) | Record nicht gefunden |
| `PrismaClientInitializationError` | DATABASE_URL nicht gesetzt |

---

## Weitere Ressourcen

- Docs: https://www.prisma.io/docs/
- API Reference: https://www.prisma.io/docs/reference/api-reference
- Best Practices: https://www.prisma.io/docs/guides/performance-optimization
