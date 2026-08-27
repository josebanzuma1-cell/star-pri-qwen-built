const DEFAULT_ITEMS = [
  "Education is Light",
  "Registration Open",
  "Namasuba • Wakiso",
  "PLE Excellence",
  "Baby Class → Primary 7",
  "Interviews Immediately",
];

export default function Marquee({
  items = DEFAULT_ITEMS,
  tone = "gold",
  className = "",
}: {
  items?: string[];
  tone?: "gold" | "outline" | "navy";
  className?: string;
}) {
  const row = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`mono-label whitespace-nowrap px-6 text-sm sm:px-9 sm:text-base ${
              tone === "gold" ? "font-bold text-navy" : "font-bold text-cream"
            }`}
          >
            {item}
          </span>
          <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 ${tone === "gold" ? "text-navy" : "text-gold"}`} aria-hidden="true">
            <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  const bg = tone === "gold" ? "bg-gold" : "bg-navy-2 border-y border-gold/15";

  return (
    <div className={`marquee ${bg} ${className}`} role="presentation">
      <div className="marquee-track items-center py-3.5 sm:py-4">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
