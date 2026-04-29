export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-bg-primary text-text-cream">
      <div
        className="w-20 h-20 rounded-full mb-6 flex items-center justify-center"
        style={{
          background: "#7A1E2A",
          border: "1.5px solid rgba(201,162,74,0.85)",
        }}
      >
        <span className="font-serif text-4xl">T</span>
      </div>
      <h1 className="font-serif text-3xl mb-3">Du bist offline</h1>
      <p className="text-text-cream/70 max-w-sm mb-8 leading-relaxed">
        Sobald du wieder Verbindung hast, kannst du bestellen und reservieren.
        Die zuletzt geladenen Inhalte sind weiterhin verfügbar.
      </p>
      <a
        href="/"
        className="px-6 py-3 rounded-full text-sm tracking-wide"
        style={{ background: "#7A1E2A", color: "#FAF6EE" }}
      >
        Erneut versuchen
      </a>
    </main>
  );
}
