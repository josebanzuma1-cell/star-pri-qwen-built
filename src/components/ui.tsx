import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap, reducedMotion } from "../lib/gsap";
import { prefersReduced, isCoarsePointer } from "../lib/helpers";

/* ---------- scroll reveal ---------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ---------- magnetic hover (fine pointers only) ---------- */
export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || isCoarsePointer()) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: "power2.out" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}

/* ---------- 3D tilt card ---------- */
export function Tilt({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || isCoarsePointer()) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    };
    const leave = () => {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [max]);
  return (
    <div ref={ref} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}

/* ---------- photo slot ----------
   Loads images/<name>.jpg from public/images — the school's real photo.
   Until a real photo exists, it renders a quiet blank placeholder that keeps
   the exact aspect ratio (no layout shift) and looks intentional.          */
export function SmartImg({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  onLoad,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} — photo coming soon`}
        className={`flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-cream-2 via-cream to-cream-2 ${className}`}
        style={{ aspectRatio: width && height ? `${width} / ${height}` : "4 / 3" }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold/70" aria-hidden="true">
          <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
        </svg>
        <span className="mono-label text-[8.5px] text-navy/35">Photo coming soon</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      onLoad={onLoad}
      onError={() => setFailed(true)}
    />
  );
}

/* ---------- animated count-up ---------- */
export function CountUp({
  to,
  suffix = "",
  duration = 1800,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setValue(to);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

/* ---------- section header ---------- */
export function SectionHead({
  index,
  label,
  title,
  tone = "light",
}: {
  index: string;
  label: string;
  title: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="#FFC93C" />
          </svg>
          <span className={`eyebrow ${tone === "light" ? "text-gold" : "text-amber"}`}>
            {index} / {label}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`h-xl mt-6 max-w-2xl ${tone === "light" ? "text-cream" : "text-navy"}`}>{title}</h2>
      </Reveal>
    </div>
  );
}

/* ---------- twinkling star field for dark sections ---------- */
export function StarSparkles({ count = 12, className = "" }: { count?: number; className?: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${(i * 37 + 13) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        size: 6 + ((i * 7) % 10),
        delay: `${(i * 0.55) % 4}s`,
      })),
    [count]
  );
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {stars.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="twinkle absolute text-gold/60"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
        >
          <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
