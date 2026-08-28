import { useCallback, useEffect, useRef, useState } from "react";
import { AmbassadorPanel, RegisterPanel } from "./Ambassador";
import { prefersReduced } from "../lib/helpers";

/* How long after the page settles before the invitation appears. Long enough
   that it does not fight the preloader lift or the hero intro. */
const OPEN_DELAY_MS = 2600;

export default function JoinModal({ refCode, ready }: { refCode: string; ready: boolean }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Open once, a beat after the intro has finished. */
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setOpen(true), prefersReduced() ? 600 : OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    restoreTo.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    /* body overflow alone does not stop Lenis's wheel handling. */
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      restoreTo.current?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[350] flex items-start justify-center overflow-y-auto bg-navy-3/90 px-4 py-8 backdrop-blur-sm sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
      onMouseDown={(e) => {
        /* Backdrop only — never a drag that started inside the panel. */
        if (!panelRef.current?.contains(e.target as Node)) close();
      }}
    >
      <div ref={panelRef} className="pop-in relative w-full max-w-5xl">
        <div className="mb-5 flex items-start justify-between gap-5">
          <div>
            <span className="eyebrow text-gold">Registration is open</span>
            <h2 id="join-modal-title" className="h-lg mt-2 text-cream">
              Join the hill, or <em className="italic text-gold">carry the light.</em>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/65">
              Register your child for an immediate interview, or become a Parent Ambassador and
              earn a tuition credit for every family you bring.
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-gold hover:text-gold"
            aria-label="Close and browse the site"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AmbassadorPanel idPrefix="m-" />
          <RegisterPanel refCode={refCode} idPrefix="m-" />
        </div>

        <div className="mt-5 flex justify-center">
          <button
            onClick={close}
            className="mono-label rounded-full border border-cream/20 px-5 py-2.5 text-[9.5px] text-cream/60 transition hover:border-gold hover:text-gold"
          >
            Maybe later — just show me the school
          </button>
        </div>
      </div>
    </div>
  );
}
