# ★ Star Primary & Nursery School Namasuba — Website + Parent Ambassador Referral Engine

> "Education is Light" — an award-caliber single-page site for Star Primary & Nursery School
> Namasuba (Ndikutamadda Hill, opposite SOGEA, Namasuba, Makindye-Ssabagabo, Wakiso District),
> with a fully functional Parent Ambassador referral engine.

Built with **React + Vite + Tailwind CSS v4 + GSAP (ScrollTrigger) + Lenis**.
Design: dark blue + pale purple + gold · Archivo display · Plus Jakarta Sans body · IBM Plex Mono labels.

---

## Quick start

```bash
npm install
npm run dev        # local dev
npm run build      # production build → dist/
```

## Page structure

| #   | Section        | Notes |
| --- | -------------- | ----- |
| —   | Preloader      | Gold star draws itself; "EDUCATION IS LIGHT" decodes; curtain lifts |
| —   | Nav            | Glass blur, scroll progress bar, active-link underline, full-screen mobile menu |
| —   | Hero           | Line-mask headline, scattered-postcard collage (Ken Burns + parallax), stat chips |
| —   | Marquee        | Infinite gold band, pauses on hover |
| 01  | About          | Sticky two-column, fact cards, animated counters (demo figures, editable) |
| 02  | Programs       | Pinned horizontal scroll (5 panels + drag support + progress bar) |
| 03  | Gallery        | Masonry, blur-up lazy images, keyboard-navigable lightbox |
| 04  | Admissions     | Self-drawing gold journey line, 4 steps, CTA panel |
| 05  | Ambassadors    | **Referral engine**: signup → dashboard (code / smart link / QR / WhatsApp / stats) + registration form |
| 06  | Testimonials   | Auto-rotating, draggable parent quotes (placeholders — editable) |
| 07  | Contact        | Phones, email, Facebook, embedded Google Map, WhatsApp deep links |
| —   | Admin          | `#/admin` (footer "Staff login") — demo passcode: **starlight** |

## The referral engine

Every current parent can become a **verified ambassador** and gets three sharing methods:

- **A — Special code** (e.g. `STAR-7K2M9`), typed manually by new families.
- **B — Smart link** `{origin}/?ref=STAR-XXXXX` — logs a click, pre-fills the registration
  form, and shows the welcome toast *"⭐ You were referred by a current Star family."*
- **C — QR code** of the smart link + one-tap WhatsApp share + native share fallback.

**Flows implemented:** ambassador signup → code generation (confetti) → dashboard with copy
buttons, QR, live stats (link opens / registrations / enrolments); registration form with inline
validation and animated success state; admin console with lead pipeline
(`new → contacted → tour → applied → admitted → enrolled → paid → reward_issued`) and CSV export.

**Attribution rules:** first code wins • duplicate detection by phone • clicks stored with
timestamp + code.

### Demo mode → real backend

All data lives in `localStorage` via **`src/services/api.js`** (`createAmbassador`, `logClick`,
`createLead`, `getStats`, `getAllLeads`, `getAllAmbassadors`, `updateLeadStatus`).

Each function already contains a **commented, ready-to-enable `fetch()` call** to a `/api/*`
endpoint. To go live:

1. Set `VITE_API_BASE` in `.env` (see `.env.example`).
2. Uncomment the fetch blocks in `src/services/api.js` (and remove the localStorage bodies).
3. Nothing in the UI needs to change.

Admin passcode (`starlight`) is a demo gate — replace with real auth server-side.

## Images — blank slots, ready for your real photos

There are **no AI or generated images** in this project. Every photo location is a clean blank
slot (`SmartImg` in `src/components/ui.tsx`) that shows a quiet "photo coming soon" placeholder
until you add the real thing.

To add a photo, drop the file into `public/images/` with the matching name — zero code changes:

| File               | Shows up in                     |
| ------------------ | ------------------------------- |
| `hero-1.jpg`       | Hero main postcard (+ preload*) |
| `hero-2.jpg`       | Hero postcard + gallery          |
| `learning.jpg`     | About section + gallery          |
| `nursery.jpg`      | Gallery (early years)            |
| `pride.jpg`        | Gallery (flag assembly)          |
| `compound.jpg`     | Hero postcard + gallery          |

\* Re-enable the preload line in `index.html` (commented, ready) once `hero-1.jpg` exists.

Captions/alt text live in `src/components/Hero.tsx` and `src/components/Gallery.tsx`.

## Editing content

- **Stats/counters** (demo figures): `src/components/About.tsx` → `STATS`.
- **Testimonials**: `src/components/Testimonials.tsx` → `QUOTES`.
- **Phone numbers / WhatsApp**: `src/lib/helpers.ts` → `SCHOOL_PHONES`, `waLink(...)`.
- **Program panels**: `src/components/Programs.tsx` → `PANELS`.
- **Ambassador terms microcopy**: bottom of the dashboard card in `src/components/Ambassador.tsx`.

## Accessibility & performance

Semantic landmarks + skip link • visible gold focus rings • aria-labels on all interactive
elements • form errors announced inline • keyboard-navigable lightbox & menus • AA contrast •
`prefers-reduced-motion` disables Lenis, parallax, pins and the scramble/curtain intro
(content is shown instantly) • lazy images with dimensions (no CLS) • font-display swap.

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Star Schools Namasuba — site + Parent Ambassador referral engine"
git branch -M main
git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
git push -u origin main
```

Use a personal access token (or `gh auth login`) for HTTPS authentication.
`.gitignore` already excludes `node_modules/`, `dist/` and `.env`.
