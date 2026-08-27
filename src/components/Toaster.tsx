import { useEffect, useState } from "react";

type Toast = { id: string; message: string; tone: "gold" | "green" | "plain" };

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Toast;
      setToasts((prev) => [...prev.slice(-3), detail]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== detail.id));
      }, 4600);
    };
    window.addEventListener("star:toast", handler);
    return () => window.removeEventListener("star:toast", handler);
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-[360] flex w-[min(92vw,380px)] flex-col gap-3"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-in pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-2xl backdrop-blur-md ${
            t.tone === "green"
              ? "border-leaf/50 bg-[#231d52]/95 text-cream"
              : "border-gold/30 bg-navy-3/95 text-cream"
          }`}
        >
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <path
              d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z"
              fill={t.tone === "green" ? "#BDB2F5" : "#FFC93C"}
            />
          </svg>
          <p className="text-sm leading-snug">{t.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-auto shrink-0 rounded p-1 text-cream/50 transition hover:text-gold"
            aria-label="Dismiss notification"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
