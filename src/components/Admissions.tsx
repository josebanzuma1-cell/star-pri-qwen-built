import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "../lib/gsap";
import { Magnetic, Reveal, StarSparkles } from "./ui";
import { SCHOOL_PHONES, waLink } from "../lib/helpers";

const STEPS = [
  {
    title: "Apply online",
    copy: "Fill the short registration form on this page — two minutes, any device. We reply the same day.",
  },
  {
    title: "Tour + immediate interview",
    copy: "Come up the hill, see the classes and compound. Interviews are carried out immediately — no waiting lists.",
  },
  {
    title: "Submit documents",
    copy: "Bring the child's birth certificate, passport photos, and the most recent report from the previous school.",
  },
  {
    title: "Pay fees & join the Star family",
    copy: "Complete the fee formalities and your child walks in on the next school morning. Karibu — welcome home.",
  },
];

export default function Admissions() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line || reducedMotion()) return;
    const tween = gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: line, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="admissions" className="beams relative overflow-hidden bg-navy-2" aria-label="Admissions journey">
      <StarSparkles count={12} />
      <span className="text-outline pointer-events-none absolute right-0 top-8 select-none font-display text-[15vw] font-extrabold leading-none opacity-50" aria-hidden="true">
        04
      </span>

      <div className="section-pad relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="#FFC93C" />
                  </svg>
                  <span className="eyebrow text-gold">04 / Admissions</span>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="h-xl mt-6 text-cream">
                  The Star door is <em className="italic text-gold">already open.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-md leading-relaxed text-cream/70">
                  Registration is open and interviews are carried out immediately. Four small
                  steps stand between your child and a bright new hill-top classroom.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Magnetic>
                    <a
                      href="#register"
                      className="btn btn-gold"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("register")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
                      }}
                    >
                      Start step one ★
                    </a>
                  </Magnetic>
                  <a
                    href={waLink("256759443714", "Hello Star Schools Namasuba! We would like to book a school tour and interview.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    aria-label="Chat with admissions on WhatsApp"
                  >
                    WhatsApp us
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="absolute bottom-6 left-[22px] top-2 w-px bg-cream/12 sm:left-[26px]" aria-hidden="true">
              <div ref={lineRef} className="h-full w-full origin-top bg-gradient-to-b from-gold via-amber to-gold/30" />
            </div>
            <ol className="space-y-10">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.06}>
                    <div className="group relative flex gap-6 sm:gap-8">
                      <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-navy-2 font-display text-lg font-bold text-gold shadow-[0_0_24px_rgba(255,201,60,0.25)] transition-transform duration-500 group-hover:scale-110 sm:h-[52px] sm:w-[52px] sm:text-xl">
                        {i + 1}
                      </span>
                      <div className="glass -mt-2 flex-1 rounded-xl p-6 transition-all duration-500 group-hover:border-gold/45 group-hover:bg-navy-3/40 sm:-mt-1 sm:p-7">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-display text-xl font-bold text-cream sm:text-2xl">{s.title}</h3>
                          <span className="mono-label text-[9px] text-gold/70">step {i + 1} of 4</span>
                        </div>
                        <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-cream/70 sm:text-[15px]">{s.copy}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={0.1}>
              <div className="relative mt-12 overflow-hidden rounded-2xl bg-gold p-8 text-navy sm:p-10">
                <svg viewBox="0 0 24 24" className="absolute -right-6 -top-6 h-36 w-36 text-navy/10" aria-hidden="true">
                  <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
                </svg>
                <p className="eyebrow text-navy/70">No waiting lists</p>
                <p className="font-display mt-3 max-w-md text-2xl font-bold leading-snug sm:text-3xl">
                  Interviews are carried out immediately — <em className="italic">visit us today.</em>
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                  {SCHOOL_PHONES.slice(0, 2).map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="group flex items-center gap-2.5 font-medium underline-offset-4 hover:underline">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.8.7a2 2 0 0 1 1.7 2Z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {p.value}
                    </a>
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
