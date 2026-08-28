import { useCallback, useEffect, useRef, useState } from "react";
import { AmbassadorPanel, RegisterPanel } from "./Ambassador";
import { prefersReduced } from "../lib/helpers";

/* How long after the page settles before the invitation appears. Long enough
   that it does not fight the preloader lift or the hero intro. */
const OPEN_DELAY_MS = 2600;

/* Phone sheet: how much of it rests below the fold before you swipe up. */
const PEEK_RATIO = 0.34;
const EXPAND_SWIPE_PX = 56; // upward travel that commits to expanding
const COLLAPSE_SWIPE_PX = 90; // downward travel that collapses, then dismisses

type Tab = "register" | "ambassador";

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "register", label: "Register my child", hint: "Book an immediate interview" },
  { id: "ambassador", label: "Become an ambassador", hint: "Earn a tuition credit" },
];

export default function JoinModal({ refCode, ready }: { refCode: string; ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("register");
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );
  /* Reduced motion skips the gesture entirely — show it all at once. */
  const [expanded, setExpanded] = useState(() => prefersReduced());
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  /* Gesture state lives in refs, not state: touchstart and the first touchmove
     can arrive in the same tick, before React has re-rendered, so a state flag
     would still read false and the drag would drop its opening frames. */
  const dragStartY = useRef(0);
  const draggingRef = useRef(false);
  const dragYRef = useRef(0);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsPhone(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

  /* The drag lives on the grip and heading only, never on the scrolling form,
     so the swipe and the scroll can never fight each other. */
  const onTouchStart = (e: React.TouchEvent) => {
    if (!isPhone) return;
    dragStartY.current = e.touches[0].clientY;
    draggingRef.current = true;
    dragYRef.current = 0;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    /* Resist pulling above the fully-open position. */
    const next = expandedRef.current && dy < 0 ? dy * 0.25 : dy;
    dragYRef.current = next;
    setDragY(next);
  };
  const onTouchEnd = () => {
    if (!draggingRef.current) return;
    const dy = dragYRef.current;
    draggingRef.current = false;
    setDragging(false);
    setDragY(0);
    if (!expandedRef.current && dy <= -EXPAND_SWIPE_PX) return setExpanded(true);
    if (expandedRef.current && dy >= COLLAPSE_SWIPE_PX) return setExpanded(false);
    if (!expandedRef.current && dy >= COLLAPSE_SWIPE_PX) close();
  };

  if (!open) return null;

  /* Resting states come from CSS; only an in-progress drag needs an inline
     transform, offset from whichever state it started in. */
  const sheetTransform =
    isPhone && dragging
      ? `translateY(calc(${expanded ? "0%" : `${PEEK_RATIO * 100}%`} + ${dragY}px))`
      : undefined;

  const content = (
    <>
      <div
        className={isPhone ? "join-grip shrink-0" : "shrink-0"}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {isPhone && (
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse the form" : "Expand the form to see all of it"}
            className="mb-2.5 flex h-6 w-full items-center justify-center"
          >
            <span className="h-1.5 w-11 rounded-full bg-cream/30 transition-colors hover:bg-gold/70" />
          </button>
        )}

        <div className="flex items-start justify-between gap-4">
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

        {isPhone && !expanded && (
          <p className="mono-label mt-2.5 text-center text-[8.5px] text-cream/40">
            Swipe up to see the whole form
          </p>
        )}

        <div
          role="tablist"
          aria-label="Choose what to do"
          className="mt-3.5 flex gap-1.5 rounded-2xl border border-cream/12 bg-navy-3/70 p-1.5"
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
      </div>

      <div
        ref={bodyRef}
        id="join-tabpanel"
        role="tabpanel"
        aria-labelledby={`join-tab-${tab}`}
        tabIndex={0}
        data-lenis-prevent
        className="join-scroll mt-3.5 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl"
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
    </>
  );

  return (
    <div
      ref={dialogRef}
      className={`join-dialog fixed inset-0 z-[350] flex justify-center bg-navy-3/90 backdrop-blur-sm ${
        isPhone ? "items-end px-0" : "items-center px-3 sm:px-6"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
      data-lenis-prevent
      onMouseDown={(e) => {
        /* Backdrop only — never a drag that started inside the panel. */
        if (!panelRef.current?.contains(e.target as Node)) close();
      }}
    >
      <div
        ref={panelRef}
        style={sheetTransform ? { transform: sheetTransform } : undefined}
        className={
          isPhone
            ? `join-sheet ${expanded ? "is-expanded" : ""} ${dragging ? "is-dragging" : ""} relative flex w-full flex-col rounded-t-3xl border-t border-cream/12 bg-navy-3 px-4 pb-4 pt-2.5 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]`
            : "pop-in relative flex max-h-full w-full max-w-2xl flex-col"
        }
      >
        {content}
      </div>
    </div>
  );
}
