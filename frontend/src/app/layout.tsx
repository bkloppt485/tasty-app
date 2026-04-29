import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Pacifico } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tasty — Ristorante & Döner · Kassel",
  description:
    "Tasty Kassel — eine ruhige, italienische Hommage an guten Geschmack.",
};

export const viewport: Viewport = {
  themeColor: "#2D0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${cormorant.variable} ${pacifico.variable}`}
    >
      <body className="font-sans antialiased bg-bg-primary text-text-cream">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
