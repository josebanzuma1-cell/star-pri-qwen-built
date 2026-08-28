import { useCallback, useEffect, useRef, useState } from "react";
import { AmbassadorPanel, RegisterPanel } from "./Ambassador";
import { prefersReduced } from "../lib/helpers";

/* How long after the page settles before the invitation appears. Long enough
   that it does not fight the preloader lift or the hero intro. */
const OPEN_DELAY_MS = 2600;

type Tab = "register" | "ambassador";

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "register", label: "Register my child", hint: "Book an immediate interview" },
  { id: "ambassador", label: "Become an ambassador", hint: "Earn a tuition credit" },
];

export default function JoinModal({ refCode, ready }: { refCode: string; ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("register");
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Open once, a beat after the intro has finished. */
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setOpen(true), prefersReduced() ? 600 : OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [ready]);

  /* A switched tab should start at the top of its form, not mid-scroll. */
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [tab]);

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
      className="fixed inset-0 z-[350] flex items-center justify-center bg-navy-3/90 px-3 py-4 backdrop-blur-sm sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
      onMouseDown={(e) => {
        /* Backdrop only — never a drag that started inside the panel. */
        if (!panelRef.current?.contains(e.target as Node)) close();
      }}
    >
      {/* Column capped to the viewport: header, tabs and footer stay put while
          only the form scrolls, so the close button is always reachable. */}
      <div ref={panelRef} className="pop-in relative flex max-h-full w-full max-w-2xl flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div>
            <span className="eyebrow text-gold">Registration is open</span>
            <h2 id="join-modal-title" className="h-lg mt-1.5 text-cream">
              Join the <em className="italic text-gold">hill.</em>
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={close}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-gold hover:text-gold"
            aria-label="Close and browse the site"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Choose what to do"
          className="mt-3.5 flex shrink-0 gap-1.5 rounded-2xl border border-cream/12 bg-navy-3/70 p-1.5"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                id={`join-tab-${t.id}`}
                aria-selected={active}
                aria-controls="join-tabpanel"
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ${
                  active ? "bg-gold text-navy" : "text-cream/70 hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <span className="block text-[12.5px] font-bold leading-tight sm:text-sm">{t.label}</span>
                <span
                  className={`mono-label mt-1 block text-[8.5px] leading-tight ${
                    active ? "text-navy/65" : "text-cream/40"
                  }`}
                >
                  {t.hint}
                </span>
              </button>
            );
          })}
        </div>

        <div
          ref={bodyRef}
          id="join-tabpanel"
          role="tabpanel"
          aria-labelledby={`join-tab-${tab}`}
          tabIndex={0}
          className="mt-3.5 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl"
        >
          {tab === "register" ? (
            <RegisterPanel refCode={refCode} idPrefix="m-" />
          ) : (
            <AmbassadorPanel idPrefix="m-" />
          )}
        </div>

        <div className="mt-3.5 flex shrink-0 justify-center">
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
