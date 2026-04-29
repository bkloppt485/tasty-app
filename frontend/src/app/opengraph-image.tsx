import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tasty — Ristorante & Döner · Kassel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #2D0A0F 0%, #4A1520 50%, #2D0A0F 100%)",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #C9A24A, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #C9A24A, transparent)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#C9A24A",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Ristorante · Döner · Kassel
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 180,
            color: "#FAF6EE",
            fontStyle: "italic",
            lineHeight: 1,
            fontWeight: 300,
          }}
        >
          Tasty
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            width: 120,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #C9A24A, transparent)",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            color: "rgba(250,246,238,0.78)",
            fontStyle: "italic",
            textAlign: "center",
            maxWidth: 880,
          }}
        >
          Eine ruhige Hommage an guten Geschmack.
        </div>
      </div>
    ),
    { ...size },
  );
}
