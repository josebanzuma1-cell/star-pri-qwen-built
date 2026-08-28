import confetti from "canvas-confetti";

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/* Toast bus — the <Toaster/> component listens for these events. */
export function toast(message: string, tone: "gold" | "green" | "plain" = "gold") {
  window.dispatchEvent(
    new CustomEvent("star:toast", {
      detail: { message, tone, id: `${Date.now()}-${Math.random()}` },
    })
  );
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export const CLASS_OPTIONS = [
  "Baby Class",
  "Middle Class",
  "Top Class",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "Primary 7",
];

export function smartLink(code: string): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?ref=${encodeURIComponent(code)}`;
}

export const SCHOOL_PHONES = [
  { label: "Call / WhatsApp", value: "0759 443 714", tel: "+256759443714" },
  { label: "Admissions", value: "0757 543 772", tel: "+256757543772" },
  { label: "Office", value: "0700 942 978", tel: "+256700942978" },
  { label: "Head Teacher", value: "+256 774 433 477", tel: "+256774433477" },
];

export function waLink(phone: string | null, message: string): string {
  const base = phone ? `https://wa.me/${phone.replace(/[^\d]/g, "")}` : "https://wa.me";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function waShareMessage(link: string): string {
  return `✨ Education is Light! ✨\n\nWe found a wonderful school for our children — Star Primary & Nursery School Namasuba, at the top of Ndikutamadda Hill (opposite SOGEA), Wakiso.\n\nNursery (Baby → Top Class) & Primary 1–7 with strong PLE preparation. Registration is open and interviews happen immediately.\n\nJoin through my family link: ${link}\n\nCall 0759 443 714 for a tour. ⭐`;
}

export function burst(originX = 0.5, originY = 0.42) {
  if (prefersReduced()) return;
  const colors = ["#FFC93C", "#F7A928", "#EFECFA", "#8F85D9", "#1F2A63"];
  confetti({
    particleCount: 110,
    spread: 78,
    startVelocity: 38,
    ticks: 190,
    gravity: 0.9,
    scalar: 0.95,
    origin: { x: originX, y: originY },
    colors,
  });
  setTimeout(
    () =>
      confetti({
        particleCount: 50,
        spread: 120,
        startVelocity: 26,
        ticks: 160,
        origin: { x: originX, y: originY },
        colors,
        scalar: 0.7,
      }),
    180
  );
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  /* Union of every row's keys, in first-seen order. Taking headers from
     rows[0] alone silently drops columns whenever the rows are not all
     the same shape (seeded demo records carry fields real ones do not). */
  const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const blob = new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-UG", { day: "2-digit", month: "short", year: "numeric" });
