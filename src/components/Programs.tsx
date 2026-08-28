import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "../lib/gsap";
import { StarSparkles } from "./ui";

type Panel = {
  tag: string;
  title: string;
  copy: string;
  chips: string[];
  dark: boolean;
  icon: ReactNode;
};

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
);

const DRAG_THRESHOLD = 5; // px of travel before a drag scrubs the timeline

const PANELS: Panel[] = [
  {
    tag: "Early Years",
    title: "Nursery — where light first lands",
    copy: "Play-based learning for Baby, Middle and Top Class: song, story, blocks and safe outdoor play that builds curious, confident little ones.",
    chips: ["Baby Class", "Middle Class", "Top Class"],
    dark: false,
    icon: icon(
      <>
        <rect x="7" y="25" width="14" height="14" rx="2" />
        <rect x="27" y="25" width="14" height="14" rx="2" />
        <rect x="17" y="9" width="14" height="14" rx="2" />
        <path d="M22 14h4M24 12v4" />
      </>
    ),
  },
  {
    tag: "Full Curriculum",
    title: "Primary 1–7, taught with care",
    copy: "A complete primary curriculum with strong literacy and numeracy foundations — every pupil guided, checked on, and pushed kindly forward.",
    chips: ["Literacy", "Numeracy", "Science", "Full UNEB curriculum"],
    dark: true,
    icon: icon(
      <>
        <path d="M24 12c-4-3.2-9.5-4-15-2.6V38c5.5-1.4 11-.6 15 2.6 4-3.2 9.5-4 15-2.6V9.4C33.5 8 28 8.8 24 12Z" />
        <path d="M24 12v28.6" />
      </>
    ),
  },
  {
    tag: "PLE Excellence",
    title: "The road to Division 1",
    copy: "Rigorous PLE preparation: mock examinations, revision clinics and exam craft — a Division-1 culture built class by class, year by year.",
    chips: ["Mock exams", "Revision clinics", "Exam technique"],
    dark: false,
    icon: icon(
      <>
        <circle cx="24" cy="20" r="11" />
        <circle cx="24" cy="20" r="4.5" />
        <path d="M18 30l-5 11 8-4.5M30 30l5 11-8-4.5" />
      </>
    ),
  },
  {
    tag: "Beyond the Bell",
    title: "Co-curricular life",
    copy: "Sports, music, dance & drama and a menu of clubs — because the brightest children shine in more than one sky.",
    chips: ["Sports", "Music", "Dance & Drama", "Clubs"],
    dark: true,
    icon: icon(
      <>
        <circle cx="17" cy="28" r="10" />
        <path d="M10 21.5c4.5 3 9.5 3 14 0M17 18v20" />
        <path d="M33 8l2.2 5.3L40.5 14l-4.5 3.4 1.6 5.6-4.6-3.3-4.6 3.3 1.6-5.6L25.5 14l5.3-.7L33 8Z" />
      </>
    ),
  },
  {
    tag: "Pastoral Care",
    title: "Values & a safe hill",
    copy: "A safe, child-friendly environment with real pastoral care — discipline wrapped in love, and every pupil known by name.",
    chips: ["Child-safe campus", "Pastoral team", "Values education"],
    dark: false,
    icon: icon(
      <>
        <path d="M24 6l14 5v12c0 9-6 15.5-14 19-8-3.5-14-10-14-19V11l14-5Z" />
        <path d="M24 29s-6-3.6-6-8a3.4 3.4 0 0 1 6-2.2A3.4 3.4 0 0 1 30 21c0 4.4-6 8-6 8Z" fill="currentColor" stroke="none" opacity="0.9" />
      </>
    ),
  },
];

export default function Programs() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [panel, setPanel] = useState(0);
  const [reduced] = useState(() => reducedMotion());

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const distance = () => track.scrollWidth - window.innerWidth + 64;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(self.progress);
          setPanel(Math.min(PANELS.length - 1, Math.round(self.progress * (PANELS.length - 1))));
        },
      },
    });
    /* Hold the instance itself: invalidateOnRefresh recomputes start/end on
       every resize, so a snapshot taken here goes stale and the drag would
       clamp to the wrong range. */
    stRef.current = tween.scrollTrigger!;

    return () => {
      stRef.current = null;
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduced) return;
    /* Let links, buttons and text selection behave normally. */
    if ((e.target as HTMLElement).closest("a, button, input, select, textarea")) return;
    dragRef.current = { startX: e.clientX, startScroll: window.scrollY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const st = stRef.current;
    if (!drag || !st || reduced) return;
    const dx = drag.startX - e.clientX;
    /* A few stray pixels during a click should not hijack the scroll. */
    if (Math.abs(dx) < DRAG_THRESHOLD) return;
    const target = Math.max(st.start, Math.min(st.end, drag.startScroll + dx));
    const lenis = (window as unknown as { __lenis?: { scrollTo: (v: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  };
  const endDrag = () => (dragRef.current = null);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="beams relative overflow-hidden bg-navy-3"
      aria-label="Our programs"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <StarSparkles count={12} />
      <div className="relative flex min-h-svh flex-col justify-center py-20">
        <div className="mx-auto flex w-full max-w-[1440px] items-end justify-between gap-6 px-5 sm:px-8">
          <div>
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="#FFC93C" />
              </svg>
              <span className="eyebrow text-gold">02 / Programs</span>
            </div>
            <h2 className="h-xl mt-5 max-w-2xl text-cream">
              One hill, <em className="italic text-gold">five</em> ways to shine.
            </h2>
          </div>
          <div className="hidden text-right sm:block">
            <p className="mono-label text-[10px] text-cream/50">
              {String(panel + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
            </p>
            <p className="mono-label mt-2 text-[9px] text-cream/35">drag or scroll →</p>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[1440px] px-5 sm:px-8">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-cream/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-amber"
              style={{ width: `${Math.max(4, progress * 100)}%`, transition: reduced ? "none" : "width 0.15s linear" }}
            />
          </div>
        </div>

        <div
          ref={trackRef}
          className={`mt-10 flex gap-6 pl-5 pr-[10vw] sm:pl-8 ${
            reduced ? "no-scrollbar w-full snap-x snap-mandatory overflow-x-auto" : "will-change-transform"
          }`}
          style={{ width: reduced ? "100%" : "max-content" }}
        >
          {PANELS.map((p, i) => (
            <article
              key={p.title}
              className={`group relative flex w-[86vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl p-8 transition-colors duration-500 sm:w-[440px] sm:p-10 ${
                p.dark ? "border border-gold/15 bg-navy-2 text-cream" : "bg-cream text-navy"
              }`}
            >
              <span
                className={`font-display pointer-events-none absolute -right-3 -top-7 select-none text-[11rem] font-extrabold leading-none ${
                  p.dark ? "text-cream/5" : "text-navy/5"
                }`}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                <div className={`flex items-center justify-between ${p.dark ? "text-gold" : "text-amber"}`}>
                  {p.icon}
                  <span className={`mono-label rounded-full border px-3 py-1.5 text-[9px] ${p.dark ? "border-gold/30 text-gold" : "border-navy/25 text-navy/70"}`}>
                    {p.tag}
                  </span>
                </div>
                <h3 className="h-lg mt-8 max-w-[16ch]">{p.title}</h3>
                <p className={`mt-4 max-w-[34ch] leading-relaxed ${p.dark ? "text-cream/70" : "text-ink/70"}`}>{p.copy}</p>
              </div>
              <ul className="relative mt-9 flex flex-wrap gap-2">
                {p.chips.map((c) => (
                  <li
                    key={c}
                    className={`mono-label rounded-full px-3 py-1.5 text-[9px] transition-colors duration-300 ${
                      p.dark
                        ? "bg-cream/8 text-cream/70 group-hover:bg-gold/15 group-hover:text-gold"
                        : "bg-navy/8 text-navy/70 group-hover:bg-navy group-hover:text-gold"
                    }`}
                  >
                    ★ {c}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <a
            href="#admissions"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("admissions");
              if (!el) return;
              const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
              if (lenis) lenis.scrollTo("#admissions", { offset: -64 });
              else el.scrollIntoView({ behavior: "auto" });
            }}
            className="group flex w-[70vw] shrink-0 snap-start flex-col items-start justify-center rounded-2xl border border-dashed border-gold/40 p-10 transition-colors hover:bg-gold/5 sm:w-[360px]"
          >
            <span className="eyebrow text-gold">Next stop</span>
            <p className="font-display mt-4 text-3xl font-bold text-cream">
              See how to <em className="italic text-gold">join us →</em>
            </p>
            <p className="mt-3 text-sm text-cream/55">Four simple steps to the Star family.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
