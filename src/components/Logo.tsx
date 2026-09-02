/**
 * The school badge, exactly as the school draws it.
 *
 * This is the real crest from the signboard and the uniforms — the lilac
 * studio background has been masked out to transparency, nothing else about
 * the artwork has been touched.
 *
 * Because the crest is dark magenta line art, it disappears against the
 * violet page. On dark surfaces it therefore sits on a soft cream plate, the
 * way the school prints it on a shirt: the mark stays exact and stays legible.
 */
export default function Logo({
  className = "",
  plate = true,
  title = "Star Primary & Nursery School Namasuba",
}: {
  className?: string;
  /** Cream disc behind the crest — needed on the dark violet surfaces. */
  plate?: boolean;
  title?: string;
}) {
  const img = (
    <img
      src="images/badge.png"
      width={211}
      height={228}
      alt={title}
      className={plate ? "h-full w-full object-contain" : className}
      loading="eager"
      decoding="async"
    />
  );

  if (!plate) return img;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-cream p-[9%] shadow-[0_6px_20px_-8px_rgba(20,6,32,0.75)] ring-1 ring-cream/40 ${className}`}
      role={title ? undefined : "presentation"}
    >
      {img}
    </span>
  );
}
