import { useEffect, useRef, useState } from "react";
import { Reveal, SectionHead } from "./ui";

/* Placeholder quotes — clearly editable. Swap with real parent voices. */
const QUOTES = [
  {
    quote:
      "We toured three schools in Namasuba. Star was the only one where the head teacher knew our daughter's name by the second visit — before she'd even enrolled.",
    name: "Mrs. Namutebi S.",
    role: "Parent, Primary 2",
  },
  {
    quote:
      "The PLE revision clinics changed everything for our son. He walked into the exam calm, and walked out in Division 1. The hill deserves the credit.",
    name: "Mr. Ssentongo K.",
    role: "Parent of a P7 graduate",
  },
  {
    quote:
      "My twins started Baby Class crying at the gate every morning. This term they cried when the holidays began. As a mother, that tells me everything.",
    name: "Nakato Prossy",
    role: "Parent of twins, Top Class",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragRef = useRef<{ x: number } | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 6000);
    return () => window.clearInterval(t);
  }, [paused]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = dragRef.current;
    dragRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 60) setIdx((i) => (i + (dx < 0 ? 1 : QUOTES.length - 1)) % QUOTES.length);
  };

  return (
    <section id="testimonials" className="relative overflow-hidden bg-cream text-ink" aria-label="Parent testimonials">
      <span
        className="font-display pointer-events-none absolute -top-14 left-4 select-none text-[22rem] font-extrabold leading-none text-navy/6"
        aria-hidden="true"
      >
        “
      </span>
      <div className="section-pad relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead
              index="06"
              label="Parent voices"
              tone="dark"
              title={
                <>
                  The hill, in <em className="italic text-amber">their words.</em>
                </>
              }
            />
            <Reveal delay={0.15}>
              <p className="mt-6 text-sm leading-relaxed text-ink/55">
                Warm words from Star families — placeholder quotes, ready to be replaced with real
                voices from the community.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={() => setIdx((i) => (i + QUOTES.length - 1) % QUOTES.length)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-navy/20 text-navy transition hover:border-navy hover:bg-navy hover:text-gold"
                  aria-label="Previous testimonial"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => setIdx((i) => (i + 1) % QUOTES.length)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-navy/20 text-navy transition hover:border-navy hover:bg-navy hover:text-gold"
                  aria-label="Next testimonial"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="ml-2 flex gap-2">
                  {QUOTES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      className={`h-2 rounded-full transition-all duration-400 ${i === idx ? "w-8 bg-amber" : "w-2 bg-navy/20 hover:bg-navy/40"}`}
                      aria-label={`Go to testimonial ${i + 1}`}
                      aria-current={i === idx ? "true" : undefined}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <div
                className="relative overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_30px_70px_-30px_rgba(23,30,72,0.35)]"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                role="region"
                aria-label="Testimonial slider"
              >
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(-${idx * 100}%)` }}
                >
                  {QUOTES.map((q, i) => (
                    <blockquote key={i} className="w-full shrink-0 px-8 py-12 sm:px-14 sm:py-16" aria-hidden={i !== idx}>
                      <div className="flex gap-1 text-amber" aria-label="Five star rating">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg key={s} viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                            <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
                          </svg>
                        ))}
                      </div>
                      <p className="font-display mt-6 text-xl font-semibold leading-snug text-navy sm:text-2xl lg:text-[1.7rem]">
                        “{q.quote}”
                      </p>
                      <footer className="mt-7 flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-gold">
                          {q.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                        <div>
                          <p className="font-semibold text-navy">{q.name}</p>
                          <p className="mono-label mt-0.5 text-[9.5px] text-navy/55">{q.role}</p>
                        </div>
                        <span className="mono-label ml-auto hidden text-[8.5px] text-navy/35 sm:block">placeholder — editable</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
