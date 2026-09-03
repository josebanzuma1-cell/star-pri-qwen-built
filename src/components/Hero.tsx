import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, reducedMotion } from "../lib/gsap";
import { Magnetic, SmartImg, StarSparkles } from "./ui";

/**
 * Each postcard cycles its own little reel. Frames are a fixed 3:2 and the
 * photographs fill them with object-cover, so nothing is ever squeezed to fit
 * — most of these are 3:2 already and crop by nothing at all.
 */
type Shot = { src: string; alt: string; caption: string; w: number; h: number };

const CARDS: {
  className: string;
  tilt: string;
  speed: number;
  z: number;
  eager: boolean;
  offset: number;
  shots: Shot[];
}[] = [
  {
    className: "right-[2%] top-0 w-[54%] sm:w-[52%]",
    tilt: "-4deg",
    speed: 0.5,
    z: 10,
    eager: true,
    offset: 0,
    shots: [
      { src: "images/pupils.jpg", w: 1800, h: 1236, caption: "Our pupils, on the hill", alt: "Two Star Primary pupils in lilac shirts and navy jumpers, arms round each other, smiling" },
      { src: "images/dance-class.jpg", w: 1500, h: 1000, caption: "Dance & drama", alt: "A teacher leading a classroom of Star pupils through a dance routine" },
      { src: "images/cooking-team.jpg", w: 1500, h: 1000, caption: "Cookery club", alt: "Four Star pupils in chef hats and maroon aprons holding a plate of chapati" },
    ],
  },
  {
    className: "left-0 top-[34%] w-[46%] sm:w-[42%]",
    tilt: "5deg",
    speed: 1,
    z: 20,
    eager: false,
    offset: 2400,
    shots: [
      { src: "images/swim-joy.jpg", w: 1500, h: 1000, caption: "Swimming lessons", alt: "A Star pupil beaming over a yellow kickboard at the edge of the school pool" },
      { src: "images/netball.jpg", w: 1500, h: 1000, caption: "Netball", alt: "Star pupils passing a netball on the school field" },
      { src: "images/swim-lesson.jpg", w: 2048, h: 1356, caption: "Learning to swim", alt: "A coach guiding young swimmers across the pool" },
    ],
  },
  {
    className: "bottom-0 right-[6%] w-[44%] sm:w-[40%]",
    tilt: "-2deg",
    speed: 1.5,
    z: 30,
    eager: false,
    offset: 4800,
    shots: [
      { src: "images/campus.jpg", w: 2025, h: 1159, caption: "Top of Ndikutamadda Hill", alt: "The violet and pink Star Primary School day and boarding block" },
      { src: "images/football-juniors.jpg", w: 1500, h: 1000, caption: "Football training", alt: "Young Star footballers dribbling through cones on the school field" },
      { src: "images/tour-nature.jpg", w: 1800, h: 1200, caption: "Nature walks", alt: "Star pupils out on a nature walk beyond the school grounds" },
    ],
  },
];

/* The school's own key art opens the hero, then hands over to the film. */
const PREROLL = [
  { src: "images/banner-admission.jpg", alt: "Star Primary & Nursery School — Education is Light" },
  { src: "images/banner-resume.jpg", alt: "Excited to resume school — two Star pupils in uniform" },
];

const CARD_MS = 2600;
const SHOT_MS = 6200; // slow — the reel should drift, not flick
const PHRASE_MS = 4200;

/* The headline itself cycles these over the film. The first is the motto, so
   the page still opens on the line the school leads with. */
const PHRASES: { lead: string; accent: string }[] = [
  { lead: "Education is", accent: "Light." },
  { lead: "Become a Parent Ambassador,", accent: "earn a fees credit." },
  { lead: "Registration is open —", accent: "interviews the same day." },
  { lead: "Swimming, drums, football,", accent: "dance & drama." },
];

export default function Hero({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = reducedMotion();

  /* 0,1 = the two title cards · 2 = the film */
  const [stage, setStage] = useState(0);
  const [phrase, setPhrase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setIsPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /* Hand the backdrop from key art to footage. */
  useEffect(() => {
    if (!ready || reduced) return;
    const a = window.setTimeout(() => setStage(1), CARD_MS);
    const b = window.setTimeout(() => setStage(2), CARD_MS * 2);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [ready, reduced]);

  useEffect(() => {
    if (stage < 2 || reduced) return;
    const id = window.setInterval(() => setPhrase((p) => (p + 1) % PHRASES.length), PHRASE_MS);
    return () => window.clearInterval(id);
  }, [stage, reduced]);

  /* On a phone the film is held behind its poster: 22MB is not something to
     spend of someone's bundle without being asked. */
  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    /* Dismiss the control on the tap, not on the first decoded frame — over a
       slow connection play() can take seconds to settle, and leaving the
       button sitting there reads as though the tap never landed. Only put it
       back if playback is actually refused. */
    setPlaying(true);
    void v.play().catch(() => setPlaying(false));
  }, []);

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

  const showPlayButton = isPhone && stage >= 2 && !playing && !reduced;

  return (
    <section
      id="top"
      ref={rootRef}
      className="beams relative flex min-h-svh items-center overflow-hidden bg-navy-3 pt-28 pb-24 sm:pt-32"
      aria-label="Welcome"
    >
      <div className="hero-backdrop absolute inset-0 overflow-hidden">
        {PREROLL.map((card, i) => (
          <img
            key={card.src}
            src={card.src}
            alt=""
            aria-hidden="true"
            width={851}
            height={315}
            className={`hero-stage hero-stage-card ${stage === i ? "is-on" : ""}`}
            loading="eager"
            decoding="async"
          />
        ))}
        {stage >= 2 && (
          <video
            ref={videoRef}
            className={`hero-stage hero-video is-on ${isPhone && !playing ? "is-held" : ""}`}
            src="video/co-curricular.mp4"
            poster="images/swim-poolside.jpg"
            autoPlay={!isPhone && !reduced}
            muted
            loop
            playsInline
            preload={isPhone ? "none" : "auto"}
            tabIndex={-1}
            aria-label="Co-curricular life at Star Primary School"
            onPlaying={() => setPlaying(true)}
          />
        )}
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />
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
        <div className="hero-copy relative lg:col-span-7">
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

          {/* Driven by CSS rather than the GSAP intro: a timeline that never
              runs would strand the headline off-screen, and this one has to
              survive every reload. */}
          <h1 className="h-cycle mt-7 text-cream">
            <span className="sr-only">
              Star Nursery &amp; Primary School Namasuba — Education is Light
            </span>
            <span key={phrase} aria-hidden="true">
              <span className="cycle-line">
                <span>{PHRASES[phrase].lead}</span>
              </span>
              <span className="cycle-line">
                <span className="italic text-gold drop-shadow-[0_0_34px_rgba(255,201,60,0.35)]">
                  {PHRASES[phrase].accent}
                </span>
              </span>
            </span>
          </h1>

          <p className="hero-el mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
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

        {/* ---------- postcard reels ---------- */}
        <div className="relative h-[430px] sm:h-[540px] lg:col-span-5 lg:h-[620px]">
          {CARDS.map((card) => (
            <div key={card.className} className={`absolute ${card.className}`} data-speed={card.speed} style={{ zIndex: card.z }}>
              <Reel card={card} running={stage >= 2 && !reduced} />
            </div>
          ))}
        </div>
      </div>

      {showPlayButton && (
        <button
          onClick={play}
          className="hero-play absolute bottom-24 right-5 z-20 flex items-center gap-2.5 rounded-full border border-gold/45 bg-navy-3/85 py-2.5 pl-2.5 pr-4 text-cream backdrop-blur-md transition hover:border-gold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
          <span className="text-left">
            <span className="mono-label block text-[9px] text-gold">Play the film</span>
            <span className="mono-label block text-[8px] text-cream/50">22 MB · sound off</span>
          </span>
        </button>
      )}

      <div className="hero-el absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex" aria-hidden="true">
        <span className="mono-label text-[9px] text-cream/50">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-cream/15">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold" />
        </span>
        <style>{`@keyframes scrollcue { 0% { transform: translateY(-100%);} 100% { transform: translateY(300%);} }`}</style>
      </div>
    </section>
  );
}

/* One postcard, drifting slowly through its own set of photographs. */
function Reel({ card, running }: { card: (typeof CARDS)[number]; running: boolean }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(-1);

  useEffect(() => {
    if (!running) return;
    let interval = 0;
    const start = window.setTimeout(() => {
      const advance = () =>
        setI((n) => {
          setPrev(n);
          return (n + 1) % card.shots.length;
        });
      advance();
      interval = window.setInterval(advance, SHOT_MS);
    }, card.offset);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [running, card.offset, card.shots.length]);

  return (
    <figure
      className="postcard floaty relative"
      style={{ "--tilt": card.tilt, transform: `rotate(${card.tilt})` } as CSSProperties}
    >
      <span className="tape" aria-hidden="true" />
      {/* fixed 3:2 window — the photographs cover it, never stretch to it */}
      <div className="relative aspect-[3/2] overflow-hidden bg-cream-2">
        {card.shots.map((shot, n) => (
          <SmartImg
            key={shot.src}
            src={shot.src}
            alt={n === i ? shot.alt : ""}
            width={shot.w}
            height={shot.h}
            loading={card.eager && n === 0 ? "eager" : "lazy"}
            className={`hero-shot ${n === i ? "is-on" : ""} ${n === prev ? "is-prev" : ""}`}
          />
        ))}
      </div>
      <figcaption className="font-display absolute inset-x-0 bottom-2.5 px-2 text-center text-[12px] italic text-navy/80 sm:text-[13px]">
        {card.shots[i].caption}
      </figcaption>
    </figure>
  );
}
