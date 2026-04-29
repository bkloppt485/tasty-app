import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type ProductSeed = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  allergens: string;
  ingredients: string;
};

const PRODUCTS: ProductSeed[] = [
  // Döner
  {
    name: "Klassischer Döner",
    description: "Saftiges Kalbfleisch im hausgemachten Fladenbrot mit frischem Salat, Tomate, Zwiebel und Knoblauchsauce",
    price: 7.5,
    category: "Döner",
    image: "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=800&q=80",
    allergens: "Gluten,Laktose,Senf,Sesam",
    ingredients: "Kalbfleisch, hausgemachtes Fladenbrot (Weizenmehl, Hefe, Salz, Sesam), Eisbergsalat, Tomate, rote Zwiebel, Rotkohl, Knoblauchsauce (Joghurt, Knoblauch, Mayonnaise), Petersilie",
  },
  {
    name: "Dürüm",
    description: "Dünnes Yufka-Brot gerollt mit zartem Fleisch, knackigem Salat und cremiger Sauce",
    price: 8.5,
    category: "Döner",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&q=80",
    allergens: "Gluten,Laktose,Senf",
    ingredients: "Yufka-Teigfladen (Weizenmehl), Kalbfleisch, Eisbergsalat, Tomate, Zwiebel, Joghurt-Knoblauch-Sauce, scharfe Sauce, Petersilie",
  },
  {
    name: "Döner Box",
    description: "Pommes mit Döner-Fleisch, Salat, Käse und Sauce – die perfekte Mahlzeit to go",
    price: 9.0,
    category: "Döner",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
    allergens: "Laktose,Senf,Ei",
    ingredients: "Pommes frites (Kartoffeln, Sonnenblumenöl), Kalbfleisch, geriebener Gouda, Eisbergsalat, Tomate, Mais, Joghurt-Knoblauch-Sauce",
  },
  {
    name: "Vegetarischer Halloumi-Döner",
    description: "Gegrillter Halloumi mit Hummus, Salat und Granatapfel-Dressing im Fladenbrot",
    price: 8.0,
    category: "Döner",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    allergens: "Gluten,Laktose,Sesam",
    ingredients: "Hausgemachtes Fladenbrot, gegrillter Halloumi, Hummus (Kichererbsen, Tahini, Zitrone), Eisbergsalat, Tomate, Granatapfelkerne, Granatapfel-Dressing",
  },
  {
    name: "Lahmacun",
    description: "Türkische Pizza mit würziger Hackfleischauflage, Petersilie und Zitrone",
    price: 6.0,
    category: "Döner",
    image: "https://images.unsplash.com/photo-1601315379734-425a4be84d10?w=800&q=80",
    allergens: "Gluten",
    ingredients: "Dünner Hefeteig (Weizenmehl), Rinderhackfleisch, Tomate, Paprika, Zwiebel, Knoblauch, Petersilie, Zitrone, orientalische Gewürze",
  },

  // Italienisch
  {
    name: "Pizza Margherita",
    description: "San-Marzano-Tomaten, Fior di Latte Mozzarella, frisches Basilikum und Olivenöl",
    price: 9.5,
    category: "Italienisch",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    allergens: "Gluten,Laktose",
    ingredients: "Pizzateig (Weizenmehl Type 00, Hefe, Olivenöl, Salz), San-Marzano-Tomaten, Fior di Latte Mozzarella, frisches Basilikum, natives Olivenöl extra",
  },
  {
    name: "Pizza Salami",
    description: "Italienische Salami, Mozzarella und Tomatensauce auf knusprigem Steinofenboden",
    price: 11.0,
    category: "Italienisch",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    allergens: "Gluten,Laktose",
    ingredients: "Pizzateig, Tomatensauce, italienische Salami Milano, Mozzarella, Oregano, Olivenöl",
  },
  {
    name: "Pizza Diavola",
    description: "Scharfe Salami, Chili, Mozzarella und Tomatensauce – für Liebhaber der Schärfe",
    price: 12.5,
    category: "Italienisch",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    allergens: "Gluten,Laktose",
    ingredients: "Pizzateig, Tomatensauce, Salami piccante, Chilischoten, Mozzarella, scharfes Chiliöl, Oregano",
  },
  {
    name: "Spaghetti Bolognese",
    description: "Hausgemachte Bolognese-Sauce mit Rinderhack, fein abgeschmeckt mit Kräutern",
    price: 10.5,
    category: "Italienisch",
    image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=800&q=80",
    allergens: "Gluten,Ei,Sellerie",
    ingredients: "Spaghetti (Hartweizengrieß, Ei), Rinderhackfleisch, Tomatensauce, Karotten, Sellerie, Zwiebel, Knoblauch, Rotwein, Olivenöl, Parmesan, Basilikum",
  },
  {
    name: "Lasagne",
    description: "Klassische Lasagne al Forno mit Béchamel, Bolognese und Parmesan",
    price: 11.5,
    category: "Italienisch",
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=800&q=80",
    allergens: "Gluten,Laktose,Ei,Sellerie",
    ingredients: "Lasagneblätter (Weizenmehl, Ei), Bolognese (Rinderhack, Tomate, Sellerie, Karotte), Béchamel (Butter, Mehl, Milch), Parmesan, Mozzarella, Muskat",
  },

  // Getränke
  {
    name: "Ayran",
    description: "Erfrischendes türkisches Joghurtgetränk, leicht gesalzen",
    price: 2.0,
    category: "Getränke",
    image: "https://images.unsplash.com/photo-1626078297320-3f1c54fe5e7c?w=800&q=80",
    allergens: "Laktose",
    ingredients: "Joghurt, Wasser, Salz",
  },
  {
    name: "Coca Cola 0.5L",
    description: "Klassische Coca-Cola in der 0,5L Flasche, eiskalt serviert",
    price: 2.99,
    category: "Getränke",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80",
    allergens: "",
    ingredients: "Wasser, Zucker, Kohlensäure, Farbstoff E150d, Säuerungsmittel Phosphorsäure, natürliche Aromen, Koffein",
  },
  {
    name: "Limonata",
    description: "Italienische Zitronenlimonade mit echtem Fruchtsaft",
    price: 3.0,
    category: "Getränke",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80",
    allergens: "",
    ingredients: "Wasser, Zitronensaft (16 %), Rohrzucker, Kohlensäure, natürliches Zitronenaroma",
  },
  {
    name: "Espresso",
    description: "Kräftiger italienischer Espresso aus der Siebträgermaschine",
    price: 2.5,
    category: "Getränke",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&q=80",
    allergens: "",
    ingredients: "100 % Arabica-Bohnen, Wasser",
  },
  {
    name: "Mineralwasser",
    description: "Natürliches Mineralwasser, still oder mit Kohlensäure",
    price: 2.0,
    category: "Getränke",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80",
    allergens: "",
    ingredients: "Natürliches Mineralwasser, optional Kohlensäure",
  },

  // Desserts
  {
    name: "Tiramisu",
    description: "Hausgemachtes Tiramisu mit Mascarpone, Espresso und Kakao",
    price: 4.5,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    allergens: "Gluten,Laktose,Ei",
    ingredients: "Mascarpone, Eier, Zucker, Löffelbiskuits (Weizenmehl, Ei), Espresso, Marsala-Wein, Kakao",
  },
  {
    name: "Baklava",
    description: "Süßes orientalisches Gebäck mit Pistazien und Honigsirup",
    price: 3.5,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1625248495698-19ad4ed05e19?w=800&q=80",
    allergens: "Gluten,Schalenfrüchte,Laktose",
    ingredients: "Yufka-Teig (Weizenmehl), Pistazien, Butter, Zuckersirup, Honig, Zitronensaft",
  },
  {
    name: "Künefe",
    description: "Warmes Engelshaargebäck gefüllt mit Käse und Sirup, mit Pistazien bestreut",
    price: 5.0,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1666819482175-1e8c0395fd05?w=800&q=80",
    allergens: "Gluten,Laktose,Schalenfrüchte",
    ingredients: "Kadayif-Teig (Weizenmehl), Hatay-Käse (ungesalzen), Butter, Zuckersirup, Pistazien",
  },
];

async function main() {
  console.log("🌱 Starting Tasty database seed...");

  // Idempotent: skip if data exists and SEED_FORCE not set
  const existing = await prisma.user.count();
  const isProduction = process.env.NODE_ENV === "production";
  const force = process.env.SEED_FORCE === "1";

  if (existing > 0 && !force) {
    console.log(`✅ DB already has ${existing} users — skipping seed (set SEED_FORCE=1 to override).`);
    return;
  }

  // Hard refuse to (re-)seed default demo accounts in production unless explicit
  if (isProduction && !force) {
    console.log("✅ Production environment — skipping demo user/data seed (use SEED_FORCE=1 to override).");
    return;
  }

  await prisma.couponRedemption.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  await prisma.user.create({
    data: {
      email: "admin@gastro.de",
      password: adminPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@example.de",
      password: customerPassword,
      name: "Max Mustermann",
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users created");

  const createdProducts: Record<string, { id: string }> = {};
  for (const p of PRODUCTS) {
    const created = await prisma.product.create({ data: p });
    createdProducts[p.name] = created;
  }

  console.log(`✅ ${PRODUCTS.length} Products created`);

  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.coupon.createMany({
    data: [
      {
        code: "PIZZA-VERINIO",
        title: "Pizza des Monats",
        subtitle: "Pizza Verinio nur 4,99 €",
        imageUrl:
          "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1200&q=80",
        discountText: "4,99 €",
        discountType: "FIXED",
        discountValue: 6.91,
        minOrderValue: null,
        validUntil,
        isPersonalized: true,
      },
      {
        code: "DOENER-BOX",
        title: "Döner-Box",
        subtitle: "2 Döner + Pommes für 12 €",
        imageUrl:
          "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200&q=80",
        discountText: "12 €",
        discountType: "FIXED",
        discountValue: 5,
        minOrderValue: null,
        validUntil,
        isPersonalized: true,
      },
      {
        code: "FAMIGLIA-SUNDAY",
        title: "Familien-Abend",
        subtitle: "30 % auf alle Pasta sonntags",
        imageUrl:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80",
        discountText: "-30 %",
        discountType: "PERCENT",
        discountValue: 30,
        minOrderValue: 15,
        validUntil,
        isPersonalized: false,
      },
      {
        code: "BENVENUTO",
        title: "Erstbesteller",
        subtitle: "5 € Rabatt auf Ihre erste Bestellung",
        imageUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
        discountText: "-5 €",
        discountType: "FIXED",
        discountValue: 5,
        minOrderValue: 15,
        validUntil,
        isPersonalized: true,
      },
    ],
  });

  console.log("✅ Coupons created");

  // Sample completed order for customer history
  const klassischer = createdProducts["Klassischer Döner"];
  const cola = createdProducts["Coca Cola 0.5L"];
  await prisma.order.create({
    data: {
      userId: customer.id,
      orderType: "PICKUP",
      status: "COMPLETED",
      totalAmount: 7.5 + 2.99,
      items: {
        create: [
          { productId: klassischer.id, quantity: 1, price: 7.5 },
          { productId: cola.id, quantity: 1, price: 2.99 },
        ],
      },
    },
  });

  await prisma.address.create({
    data: {
      userId: customer.id,
      street: "Königsstraße 50",
      city: "Kassel",
      postalCode: "34117",
      country: "Deutschland",
      isDefault: true,
    },
  });

  console.log("🎉 Tasty database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
