import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, reducedMotion } from "../lib/gsap";
import { Magnetic, SmartImg, StarSparkles } from "./ui";

const CARDS = [
  {
    src: "images/pupils.jpg",
    alt: "Two Star Primary pupils in lilac shirts and navy jumpers, arms round each other, smiling",
    caption: "Our pupils, on the hill",
    className: "right-[2%] top-0 w-[54%] sm:w-[52%]",
    tilt: "-4deg",
    speed: 0.5,
    z: 10,
    eager: true,
  },
  {
    src: "images/swim-joy.jpg",
    alt: "A Star pupil beaming over a yellow kickboard at the edge of the school pool",
    caption: "Swimming lessons",
    className: "left-0 top-[34%] w-[46%] sm:w-[42%]",
    tilt: "5deg",
    speed: 1,
    z: 20,
    eager: false,
  },
  {
    src: "images/campus.jpg",
    alt: "The violet and pink Star Primary School day and boarding block on Ndikutamadda Hill",
    caption: "Top of Ndikutamadda Hill",
    className: "bottom-0 right-[6%] w-[44%] sm:w-[40%]",
    tilt: "-2deg",
  speed: 1.5,
    z: 30,
    eager: false,
  },
];

export default function Hero({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  /* Intro: line-mask reveal + staggered fade once the preloader lifts. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const lines = root.querySelectorAll(".mask-line > span");
    const els = root.querySelectorAll(".hero-el");
    gsap.set(lines, { yPercent: 115 });
    gsap.set(els, { opacity: 0, y: 28 });
    if (!ready) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(lines, { yPercent: 0, duration: 1.25, stagger: 0.16 }, 0.05).to(
      els,
      { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
      0.4
    );
    return () => {
      tl.kill();
    };
  }, [ready]);

  /* Parallax drift on the postcards. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const tweens = Array.from(root.querySelectorAll<HTMLElement>("[data-speed]")).map((card) =>
      gsap.to(card, {
        y: () => Number(card.dataset.speed) * 130,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.7 },
      })
    );
    return () =>
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="beams relative flex min-h-svh items-center overflow-hidden bg-navy-3 pt-28 pb-16 sm:pt-32"
      aria-label="Welcome"
    >
      {/* Co-curricular film, playing behind the collage. Muted and inert so it
          can autoplay; the poster carries the first paint and a violet scrim
          keeps the headline readable over moving footage. */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <video
          className="hero-video h-full w-full object-cover"
          src="video/co-curricular.mp4"
          poster="images/swim-poolside.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <StarSparkles count={16} />
      <span
        className="text-outline pointer-events-none absolute -bottom-4 left-0 select-none font-display text-[19vw] font-extrabold leading-none opacity-50 sm:text-[15vw]"
        aria-hidden="true"
      >
        Namasuba
      </span>

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* ---------- copy ---------- */}
        <div className="lg:col-span-7">
          <div className="hero-el flex flex-wrap items-center gap-3 sm:gap-4">
            <p className="eyebrow flex items-center gap-2.5 text-gold">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
              </svg>
              Namasuba • Wakiso District
            </p>
            <span className="mono-label flex items-center gap-2 rounded-full border border-leaf/50 bg-leaf/10 px-3 py-1.5 text-[9.5px] text-cream">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-leaf" />
              Registration open — interviews immediate
            </span>
          </div>

          <h1 className="h-display mt-7 text-cream">
            <span className="mask-line">
              <span>Education is</span>
            </span>
            <span className="mask-line">
              <span className="font-display italic text-gold drop-shadow-[0_0_34px_rgba(255,201,60,0.35)]">
                Light.
              </span>
            </span>
          </h1>

          <p className="hero-el mt-7 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            Quality <strong className="font-semibold text-cream">nursery</strong> and{" "}
            <strong className="font-semibold text-cream">primary education</strong> at the top of
            Ndikutamadda Hill — opposite SOGEA. From Baby Class to PLE excellence in Primary 7,
            every child is known, guided, and given room to shine.
          </p>

          <div className="hero-el mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#register"
                className="btn btn-gold"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("register")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
                }}
              >
                Register Your Child
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
            <a
              href="#ambassador"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("ambassador")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
              }}
            >
              Become a Parent Ambassador
            </a>
          </div>

          <ul className="hero-el mt-10 flex flex-wrap gap-3">
            {["Nursery → Primary 7", "PLE mock exams & revision clinics", "Safe, child-friendly hill campus"].map((chip) => (
              <li
                key={chip}
                className="glass mono-label rounded-full px-4 py-2 text-[9.5px] text-cream/85 transition-colors duration-300 hover:border-gold/50 hover:text-gold"
              >
                ★ {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- postcard collage ---------- */}
        <div className="relative h-[430px] sm:h-[540px] lg:col-span-5 lg:h-[620px]">
          {CARDS.map((card) => (
            <div key={card.src} className={`absolute ${card.className}`} data-speed={card.speed} style={{ zIndex: card.z }}>
              <figure
                className="postcard floaty relative"
                style={{ "--tilt": card.tilt, transform: `rotate(${card.tilt})` } as CSSProperties}
              >
                <span className="tape" aria-hidden="true" />
                <div className="kenburns overflow-hidden bg-cream-2">
                  <SmartImg
                    src={card.src}
                    alt={card.alt}
                    width={520}
                    height={card.src === "images/pupils.jpg" ? 420 : 400}
                    loading={card.eager ? "eager" : "lazy"}
                    className="block w-full"
                  />
                </div>
                <figcaption className="font-display absolute inset-x-0 bottom-2.5 px-2 text-center text-[12px] italic text-navy/80 sm:text-[13px]">
                  {card.caption}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div className="hero-el absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex" aria-hidden="true">
        <span className="mono-label text-[9px] text-cream/50">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-cream/15">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold" />
        </span>
        <style>{`@keyframes scrollcue { 0% { transform: translateY(-100%);} 100% { transform: translateY(300%);} }`}</style>
      </div>
    </section>
  );
}
