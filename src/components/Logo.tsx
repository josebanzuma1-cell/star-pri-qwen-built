import { useId } from "react";

/**
 * The school badge, redrawn as vector art from the crest on the uniforms and
 * the signboard: ringed roundel, gold crown over an open book with pen and
 * pencil, and the motto on a ribbon. Drawn rather than traced from the 405px
 * raster so it stays crisp at every size, from the 28px nav mark to print.
 */
export default function Logo({
  className = "",
  showRibbon = true,
  title = "Star Primary & Nursery School Namasuba",
}: {
  className?: string;
  showRibbon?: boolean;
  title?: string;
}) {
  /* Several copies of this badge render on one page; ids must not collide. */
  const uid = useId().replace(/:/g, "");
  const arc = `arc-${uid}`;
  const ribbon = `ribbon-${uid}`;

  return (
    <svg
      viewBox="0 0 120 116"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <defs>
        <path id={arc} d="M34 56 A26 26 0 0 1 86 56" />
        <path id={ribbon} d="M16 92 Q60 104 104 92" />
      </defs>

      {/* roundel */}
      <circle cx="60" cy="56" r="31" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="60" cy="56" r="27" stroke="currentColor" strokeWidth="1" opacity="0.45" />

      {/* STAR plaque */}
      <path
        d="M38 26 Q60 16 82 26 L82 34 Q60 25 38 34 Z"
        fill="currentColor"
      />
      <text
        x="60"
        y="32"
        textAnchor="middle"
        fill="var(--color-cream, #fff)"
        style={{ font: "700 9.5px var(--font-display, sans-serif)", letterSpacing: "1.6px" }}
      >
        STAR
      </text>

      {/* PRIMARY, curved inside the ring */}
      <text
        fill="currentColor"
        style={{ font: "700 8.5px var(--font-display, sans-serif)", letterSpacing: "2.2px" }}
      >
        <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">
          PRIMARY
        </textPath>
      </text>

      {/* crown */}
      <path
        d="M46 56 L51 47 L56 53 L60 44 L64 53 L69 47 L74 56 Z"
        fill="#ffc93c"
        stroke="#e8a33d"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* SCHOOL bar */}
      <rect x="41" y="59" width="38" height="11" rx="2" fill="currentColor" />
      <text
        x="60"
        y="67.4"
        textAnchor="middle"
        fill="var(--color-cream, #fff)"
        style={{ font: "700 7.6px var(--font-display, sans-serif)", letterSpacing: "1.3px" }}
      >
        SCHOOL
      </text>

      {/* open book */}
      <path
        d="M42 80 Q52 74 60 78 Q68 74 78 80 Q68 77 60 81 Q52 77 42 80 Z"
        fill="currentColor"
      />
      <path
        d="M60 78 L60 81"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* pencil (left) and pen (right), crossed behind the book */}
      <path d="M40 74 L47 79" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M80 74 L73 79" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />

      {showRibbon && (
        <>
          <path
            d="M10 88 Q60 102 110 88 L110 97 Q60 111 10 97 Z"
            fill="currentColor"
          />
          <text
            fill="var(--color-cream, #fff)"
            style={{ font: "700 7.2px var(--font-display, sans-serif)", letterSpacing: "1.5px" }}
          >
            <textPath href={`#${ribbon}`} startOffset="50%" textAnchor="middle">
              EDUCATION IS LIGHT
            </textPath>
          </text>
        </>
      )}
    </svg>
  );
}
