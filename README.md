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
timestamp + code • codes are minted unique against the existing roster • a code that no
ambassador holds is not stored on the lead (the registration is still kept, and the family is
told the code was not recognised).

### Demo mode → real backend

All data lives in `localStorage` via **`src/services/api.js`** (`createAmbassador`, `logClick`,
`createLead`, `getStats`, `getAllLeads`, `getAllAmbassadors`, `updateLeadStatus`).

Each function already contains a **commented, ready-to-enable `fetch()` call** to a `/api/*`
endpoint. To go live:

1. Set `VITE_API_BASE` in `.env` (see `.env.example`).
2. Uncomment the fetch blocks in `src/services/api.js` (and remove the localStorage bodies).
3. Nothing in the UI needs to change.

Admin passcode (`starlight`) is a demo gate — replace with real auth server-side.

## Images & film

The school's own photographs are in `public/images/`, and the co-curricular film
is at `public/video/co-curricular.mp4` (1280x720, 110s, 22 MB, shipped at its
original quality — it is not re-encoded by the build).

| Area | Files |
| ---- | ----- |
| Hero collage | `pupils.jpg` · `swim-joy.jpg` · `campus.jpg` |
| Hero film | `video/co-curricular.mp4`, poster `swim-poolside.jpg` |
| Tours | `tour-nature.jpg` · `tour-farm.jpg` |
| Swimming | `swim-poolside.jpg` · `swim-lesson.jpg` · `swim-cap.jpg` · `swim-board.jpg` |
| Dance & drama | `dance-drums.jpg` · `dance-class.jpg` |
| Cookery club | `cooking-club.jpg` · `cooking-team.jpg` · `cooking-chef.jpg` |
| Sports | `football-juniors.jpg` · `football-seniors.jpg` · `netball.jpg` · `netball-pass.jpg` |
| Welfare | `health-checkup.jpg` · `health-field.jpg` |
| About | `dance-class.jpg` |

Gallery captions, tags and alt text live in `src/components/Gallery.tsx` (`SHOTS`);
the hero collage is `CARDS` in `src/components/Hero.tsx`. `SmartImg` still falls
back to a quiet placeholder if a file is ever missing, so a wrong filename
degrades rather than breaks.

## Badge & colours

The crest is drawn as vector art in `src/components/Logo.tsx` — roundel, gold
crown, open book with pen and pencil, and the motto on a ribbon — rather than
traced from the 405px raster, so it stays sharp from the 40px nav mark upward.

The palette is taken from the school itself: the violet and magenta of the main
block, the ochre of its columns, the lilac of the uniform shirts and the gold of
the crown. The tokens in `src/index.css` keep their original navy-era names so
every existing class still works — only the hues moved, so read `navy` as "the
deep school violet".
## Editing content

- **Stats/counters** (demo figures): `src/components/About.tsx` → `STATS`.
- **Testimonials**: `src/components/Testimonials.tsx` → `QUOTES`.
- **Phone numbers / WhatsApp**: `src/lib/helpers.ts` → `SCHOOL_PHONES`, `waLink(...)`.
- **Program panels**: `src/components/Programs.tsx` → `PANELS`.
- **Ambassador terms microcopy**: bottom of the dashboard card in `src/components/Ambassador.tsx`.

## Fixes applied after the original build

| Area | What was wrong |
| ---- | -------------- |
| Smart-link pre-fill | `RegisterPanel` read the referral code during render while `App` only wrote it from an effect, so the code was missing on the first visit to a `?ref=` link — every referred family registered unattributed. Resolved in `App` during render and passed down. |
| Code uniqueness | `generateCode()` was used with no check against existing codes; a collision would merge two parents' stats. |
| Unknown codes | Any typed string was stored as the attribution. Now validated against the ambassador roster. |
| CSV export | Headers came from `rows[0]` only, dropping columns when rows differed in shape. |
| Programs drag | Cached ScrollTrigger bounds went stale on resize; drags also hijacked clicks on links. |
| Preloader | Scrambling text sat in a `role="status"` live region, announcing ~24x/second. |
| Lightbox | No focus trap, and Lenis kept scrolling behind the modal. |
| Dependencies | 10 declared packages were never imported (Supabase, Recharts, Framer Motion, dnd-kit x3, React Router, date-fns, lucide-react, uuid). |

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
