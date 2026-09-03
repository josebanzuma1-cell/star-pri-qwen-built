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
  title = "Star Nursery & Primary School Namasuba",
}: {
  className?: string;
  /** Cream disc behind the crest — needed on the dark violet surfaces. */
  plate?: boolean;
  title?: string;
}) {
  if (!plate) {
    return (
      <img
        src="images/badge.png"
        width={211}
        height={228}
        alt={title}
        className={className}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    /* The crest is positioned by insets rather than sized with height:100%.
       Percentage sizing on a flex child resolved to zero here — the mark
       vanished into a blank disc in the footer and the preloader while
       surviving in the nav — whereas insets resolve against this element's
       own padding box, which always has a definite size. */
    <span className={`badge-plate shrink-0 shadow-[0_6px_20px_-8px_rgba(20,6,32,0.75)] ring-1 ring-cream/40 ${className}`}>
      <img src="images/badge.png" width={211} height={228} alt={title} loading="eager" decoding="async" />
    </span>
  );
}
