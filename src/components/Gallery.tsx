import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal, SectionHead, SmartImg } from "./ui";

type Shot = { src: string; alt: string; caption: string; tag: string };

const SHOTS: Shot[] = [
  { src: "images/hero-1.jpg", alt: "Star Primary pupils in colourful uniforms playing in the school compound", caption: "Our pupils, at afternoon play", tag: "Campus life" },
  { src: "images/pride.jpg", alt: "Pupils in neat uniforms saluting during morning flag assembly", caption: "Morning pride on the hill", tag: "Assembly" },
  { src: "images/nursery.jpg", alt: "Nursery toddlers playing with colourful building blocks on a mat", caption: "Early years, big imaginations", tag: "Nursery" },
  { src: "images/learning.jpg", alt: "A teacher guiding pupils at their desks in a bright classroom", caption: "Learning, guided with care", tag: "Classrooms" },
  { src: "images/hero-2.jpg", alt: "Nursery children smiling with colourful face paint at a celebration", caption: "Celebration day", tag: "Events" },
  { src: "images/compound.jpg", alt: "Wide view of the Star Schools compound on Ndikutamadda Hill", caption: "Our compound, top of the hill", tag: "Campus" },
];

function LazyImage({ shot, onClick }: { shot: Shot; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Reveal className="mb-5 break-inside-avoid sm:mb-6">
      <button
        onClick={onClick}
        className="gallery-img-wrap group relative block w-full overflow-hidden rounded-xl text-left"
        aria-label={`Open photo: ${shot.caption}`}
      >
        <SmartImg
          src={shot.src}
          alt={shot.alt}
          loading="lazy"
          width={640}
          height={shot.src.includes("compound") || shot.src.includes("learning") || shot.src.includes("nursery") || shot.src.includes("hero-2") ? 480 : 780}
          onLoad={() => setLoaded(true)}
          className={`block w-full ${loaded ? "loaded" : "loading"}`}
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-3/85 via-navy-3/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-3 px-4 py-3.5 transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
          <span className="font-display text-sm italic text-cream sm:text-base">{shot.caption}</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="mono-label absolute left-3 top-3 rounded-full bg-navy-3/75 px-2.5 py-1 text-[8.5px] text-gold backdrop-blur">
          {shot.tag}
        </span>
      </button>
    </Reveal>
  );
}

export default function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = idx !== null;

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback(
    (d: number) => setIdx((i) => (i === null ? i : (i + d + SHOTS.length) % SHOTS.length)),
    []
  );

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const restoreTo = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    /* body overflow alone does not stop Lenis's wheel handling. */
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key === "ArrowRight") return step(1);
      if (e.key === "ArrowLeft") return step(-1);
      if (e.key !== "Tab" || !dialog) return;
      /* Keep focus inside the viewer while it is modal. */
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
      restoreTo?.focus?.();
    };
  }, [open, close, step]);

  return (
    <section id="gallery" className="relative overflow-hidden bg-cream text-ink" aria-label="Photo gallery">
      <span className="text-outline-ink pointer-events-none absolute -left-2 bottom-6 select-none font-display text-[15vw] font-extrabold leading-none opacity-60" aria-hidden="true">
        03
      </span>
      <div className="section-pad relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            index="03"
            label="Gallery"
            tone="dark"
            title={
              <>
                Light, caught <em className="italic text-amber">in moments.</em>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="mono-label mb-2 text-[10px] text-navy/50">
              Placeholder photos — the school's real gallery (Facebook) drops in here.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3">
          {SHOTS.map((s, i) => (
            <LazyImage key={s.src + i} shot={s} onClick={() => setIdx(i)} />
          ))}
        </div>
      </div>

      {open && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[340] flex flex-col bg-navy-3/97 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${idx! + 1} of ${SHOTS.length}: ${SHOTS[idx!].caption}`}
          onClick={close}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="mono-label text-[10px] text-cream/60">
              {String(idx! + 1).padStart(2, "0")} / {String(SHOTS.length).padStart(2, "0")} — {SHOTS[idx!].tag}
            </p>
            <button
              ref={closeRef}
              onClick={close}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-gold hover:text-gold"
              aria-label="Close photo viewer"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => step(-1)}
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-navy/60 text-cream transition hover:border-gold hover:text-gold sm:left-6"
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <figure className="pop-in max-h-full" onClick={close}>
              <SmartImg
                src={SHOTS[idx!].src}
                alt={SHOTS[idx!].alt}
                className="max-h-[74vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <figcaption className="font-display mt-4 text-center text-lg italic text-cream">
                {SHOTS[idx!].caption}
              </figcaption>
            </figure>
            <button
              onClick={() => step(1)}
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-navy/60 text-cream transition hover:border-gold hover:text-gold sm:right-6"
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
