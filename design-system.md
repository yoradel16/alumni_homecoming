# MNHS Grand Alumni Homecoming — Design System

The single source of truth for visual decisions. `css/tokens.css` is built from this file, and component and page CSS use only those tokens.

**Feel:** an evening invitation. Warm near-black "ink", cream "paper" text, and one gold accent. Thin hairlines, generous whitespace, serif display type, and small letter-spaced labels. Decoration stays restrained.

## 0. Sources and legend

**Sources:**
- The four screenshots in `/reference`: hero, sticky nav with the about section, a full-page capture at desktop width, and a full-page capture at the ≤980px layout.
- The inspo site's live stylesheet (`tayosawakas.com/css/styles.css`), read directly. Most numbers below come straight from it, not from measuring pixels.

**Every value is tagged with where it came from:**

| Tag | Meaning |
|---|---|
| `[read]` | Copied exactly from the inspo stylesheet and consistent with the screenshots |
| `[est.]` | Estimated, rounded, or computed by us (e.g., rgba flattened to hex, a normalized spacing scale) |
| `[adapted]` | Our own pattern, derived from the inspo for something it doesn't have (countdown blocks, program schedule, focus states) |

**Rules:**
- Borrow the *system*, never the assets. No inspo images, logos, or copy.
- Deviation 1, font family: the inspo uses **Cormorant Garamond**. CLAUDE.md specifies **Cormorant**, and we follow CLAUDE.md. Cormorant is the parent family with the same proportions and italic. `[adapted]`
- Deviation 2, heading style: the inspo sets entire headings in italic. Our brief wants **upright serif headings with one italic accent word in gold** (e.g., "Program of *Activities*"). `[adapted]`

**Google Fonts to load:**
- Cormorant: italic and upright, weights 300, 400, 500
- Inter: weights 400, 500, 600, plus italic 400 (for names and emphasis in body text)

The inspo also loads Inter 300 and 700 but doesn't use them. `[read, trimmed]` The `<link>` tags are kept in a comment in `css/tokens.css`.

---

## 1. Colors

A dark, warm palette. Text colors are paper at reduced opacity, so they always sit warmly on ink.

| Proposed token | Value | Role | Src |
|---|---|---|---|
| `--color-bg` | `#0E0A07` | Page background ("ink") | `[read]` |
| `--color-surface` | `#1A130D` | Cards, countdown cells, panels, icon buttons ("ink-soft") | `[read]` |
| `--color-bg-deep` | `#050302` | Footer background | `[read]` |
| `--color-text` | `#F4ECE0` | Headings and primary text ("paper") | `[read]` |
| `--color-text-muted` | `rgba(244, 236, 224, .70)` ≈ `#AFA89F` on bg | Body copy, nav links, descriptions | `[read]`, hex `[est.]` |
| `--color-text-subtle` | `rgba(244, 236, 224, .55)` ≈ `#8C867E` on bg | Micro labels, unit labels, footer links, legal line | `[read]`, hex `[est.]` |
| `--color-primary` | `#E9B775` | Gold: CTA fill, eyebrows, accent word, countdown numerals, active states | `[read]` |
| `--color-primary-deep` | `#C8924A` | Deeper gold for pressed states (defined in inspo, unused there) | `[read]` |
| `--color-on-primary` | `#0E0A07` | Text and icons on gold | `[read]` |
| `--color-accent` | `#B8645B` | Rose. A rare highlight, such as a small "New" badge. Never for large areas. | `[read]` |
| `--color-border` | `rgba(244, 236, 224, .12)` ≈ `#2A2521` on bg | Hairline dividers, card and section borders | `[read]`, hex `[est.]` |
| `--color-border-strong` | `rgba(244, 236, 224, .25)` ≈ `#48433D` on bg | Ghost-button borders, hover borders | `[read]`, hex `[est.]` |
| `--color-border-gold` | `rgba(233, 183, 117, .25)` | Card hover border | `[read]` |
| `--color-primary-tint` | `rgba(233, 183, 117, .08)` | Checked radio pill background (§5.10) | `[adapted]` |
| `--color-error` | `#D98A80` | Form errors: field border, inline message, form alert. A lifted rose; `--color-accent` is only ≈ 4.4:1 on the surface, which fails for small text. | `[adapted]` |
| `--color-overlay` | `rgba(14, 10, 7, .82)` | Scrolled navbar background (with a 20px backdrop blur) | `[read]` |
| `--color-scrim` | `rgba(14, 10, 7, .65)` | Mobile menu backdrop | `[read]` |

Prefer the rgba forms in tokens. They blend correctly over images and the surface color. The hex equivalents are only for reference and contrast checks.

**Hero image scrims** `[read]`:
- Top: a gradient from `rgba(14,10,7,.65)` to transparent over the top 30%, so the nav stays legible.
- Bottom: a gradient from `.95` to `.40` to `0` over the bottom 50%, so the text stays legible.
- Center `[adapted]`: `--gradient-scrim-center`, a radial ink tint (`ellipse 80% 70%`, `rgba(14,10,7,.70)` → transparent) behind the centered stack. `hero.png` has a bright wall behind the text; without this tint the gold eyebrow measured ~2.3:1.
- Optional: a film-grain overlay at 12% opacity using `mix-blend-mode: overlay`.

**Available, not default** `[read]`: a wine gradient `#5A1F1A → #2A0E0C` for a one-off highlight band, and a section fade `#0E0A07 → #150E09`.

### Contrast (WCAG) `[est., computed]`

| Pair | Ratio | Result |
|---|---|---|
| Text `#F4ECE0` on bg | ≈ 17:1 | AAA |
| Gold `#E9B775` on bg | ≈ 10:1 | AAA |
| Ink on gold (buttons) | ≈ 10:1 | AAA |
| Muted (.70) on bg | ≈ 8:1 | AAA |
| Subtle (.55) on bg | ≈ 5.4:1 | AA, so OK for small labels |
| Error `#D98A80` on surface / on bg | ≈ 6.9:1 / 7.4:1 | AA (small text) |
| Inspo's legal line (.35) on bg | ≈ 2.8:1 | **Fails.** We use subtle (.55) instead. |

Borders are decorative and carry no meaning, so they need no contrast ratio. Never put text in muted or subtle on the gold color.

---

## 2. Typography

### Families
- `--font-serif: "Cormorant", Georgia, "Times New Roman", serif;` for headings, values, numerals, and the large accent text
- `--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;` for body copy, labels, buttons, and navigation

### Base `[read]`
- Body: Inter, 16px, line-height 1.55, color `--color-text`, antialiased (`-webkit-font-smoothing: antialiased`).
- Headings: Cormorant, weight **300**. The light weight is a big part of the elegant feel. Use 400 only if a size reads too thin on low-density screens. `[est.]`

### Type scale

Sizes are listed mobile-first: `<641` / `641–980` / `≥981`. Clamp values scale fluidly.

| Role | Font, weight, style | Size | Line height | Letter spacing | Src |
|---|---|---|---|---|---|
| **Display** (hero h1) | Serif 300, upright, with one italic gold word | `clamp(48px, min(7vw, 11vh), 104px)` at all widths. The `11vh` term shrinks it on short screens so the hero fits. `[adapted]` | 1.05 | -0.015em | `[read]` size; upright style `[adapted]` |
| **Page title** (RSVP h1) | Serif 300 | `clamp(40px, 10vw, 64px)` / `clamp(48px, 6vw, 88px)` from 641 | 1.0 | -0.015em | `[read]` |
| **Section heading** (h2) | Serif 300 | `clamp(32px, 9vw, 56px)` / `clamp(40px, 5vw, 72px)` from 641 | 1.0 | -0.015em | `[read]` |
| **Lead / pull quote** | Serif 300 *italic* | `clamp(32px, 4vw, 56px)` | 1.25 | -0.01em | `[read]` |
| **Card title** (h3) | Serif 300 | 26px / 28px / 28px | 1.2 | -0.01em | `[read]` (26 mobile `[est.]`) |
| **Timeline title** (program item) | Sans 500, UPPERCASE, paper | 14px | 1.2 | 0.18em | `[adapted]` |
| **Date lockup** (program "30") | Serif 300 *italic*, gold | `clamp(96px, 20vw, 176px)` | 1.0 | -0.015em | `[adapted]` |
| **Value** (date, venue, names) | Serif 300 *italic* | 22px / 26px / 28px | 1.0 | 0 | `[read]` (28 desktop `[adapted]`, inspo 30) |
| **Countdown numeral** (boxed) | Serif 300 *italic*, gold, tabular figures | See §5.3 | 1.0 | 0 | `[adapted]` |
| **Countdown numeral** (compact, hero) | Serif 300 *italic*, gold, tabular figures | `clamp(32px, 4vw, 48px)` (`--fs-countdown-compact`) | 1.0 | 0 | `[adapted]` |
| **Countdown ended line** | Serif 300 *italic*, gold | `--fs-countdown-compact` | 1.0 | 0.08em (`--ls-countdown-ended`) | `[adapted]` |
| **Detail sub-line** (time, campus) | Sans 400, muted | 14px | 1.2 | 0 | `[adapted]` |
| **Body large** | Sans 400, muted | 16px / 18px / 18px | 1.7 | 0 | `[read]`, normalized to tokens `[adapted]` |
| **Body** | Sans 400 | 16px | 1.55 | 0 | `[read]` |
| **Body small** (card text, footer) | Sans 400, muted | 14–15px | 1.7 | 0 | `[read]` |
| **Eyebrow** | Sans 500, UPPERCASE, gold | 11px / 12px / 12px | 1.2 `[est.]` | **0.32em** | `[read]` (weight `[est.]`) |
| **Card date / kicker** | Sans 500, UPPERCASE, gold | 11px | 1.2 `[est.]` | 0.26em | `[read]` |
| **Micro label** (units, meta labels) | Sans 400, UPPERCASE, subtle | 10px (units 9px `[read]`, use 10px for legibility `[est.]`) | 1.2 `[est.]` | 0.30em | `[read]` |
| **Meta label** (label/value rows) | Sans 400, UPPERCASE, subtle | 12px | 1.2 `[est.]` | 0.26em | `[read]` |
| **Nav link** | Sans 400, UPPERCASE, muted | 14px | 1 | 0.18em | `[read]` |
| **Button label** | Sans 600, UPPERCASE | 13px / 16px / 16px (hero: 12 / 15 / 15) | 1 | 0.20em (hero 0.22em; nav CTA 0.18em, 0.12em at <641) | `[read]` |
| **Small button label** (card link) | Sans 500, UPPERCASE | 11px | 1 | 0.18em | `[read]` |
| **Footer heading** | Sans 600, UPPERCASE, text | 13px | 1.2 `[est.]` | 0.32em | `[read]` |
| **Legal / baseline** | Sans 400, UPPERCASE, subtle | 11px | 1.4 `[est.]` | 0.18em | `[read]` |

### Italic accent usage `[adapted]`
- **One italic word per heading.** Wrap it in `<em>` and set it in `--color-primary`. Everything else in the heading is upright paper. Examples: "Program of *Activities*", "Latest *Announcements*", "Alumni *Kumustahay*".
- Italic serif with no gold is also the style for **values**: dates, venue, names, times in the program timeline, and countdown numerals (which are gold).
- `<em>` inside body copy (sans) is italic in `--color-text`. That is brighter than the surrounding muted text, which is how the inspo emphasizes names. `[read]`
- Never italicize whole paragraphs or entire headings.
- Use tabular figures (`font-feature-settings: "tnum" 1`) for the countdown and schedule times, so digits don't jitter. `[read]`

### Proposed type tokens `[est.]`
- **Sizes:** `--fs-2xs: 10px`, `--fs-xs: 11px`, `--fs-sm: 12px`, `--fs-sm-plus: 13px`, `--fs-md: 14px`, `--fs-md-plus: 15px`, `--fs-base: 16px`, `--fs-lg: 18px`, `--fs-xl: 22px`, `--fs-2xl: 26px`, `--fs-3xl: 28px`, `--fs-4xl: 32px`.
- **Fluid sizes:** `--fs-display`, `--fs-h1`, `--fs-h1-sm`, `--fs-h2`, `--fs-h2-sm`, `--fs-lead`, `--fs-countdown`, `--fs-countdown-compact`, `--fs-date-lockup` (the clamp values above).
- **Line heights:** `--lh-tight: 1`, `--lh-heading: 1.05`, `--lh-snug: 1.2`, `--lh-lead: 1.25`, `--lh-base: 1.55`, `--lh-relaxed: 1.7`.
- **Letter spacing:** `--ls-tight: -0.015em`, `--ls-snug: -0.01em`, `--ls-nav: 0.18em`, `--ls-button: 0.2em`, `--ls-label: 0.26em`, `--ls-micro: 0.3em`, `--ls-eyebrow: 0.32em`, `--ls-countdown-ended: 0.08em`.
- **Weights:** `--fw-light: 300`, `--fw-regular: 400`, `--fw-medium: 500`, `--fw-semibold: 600`.
- **Features:** `--font-feature-tnum: "tnum" 1` (tabular figures).

### Responsive tokens
Defined in `tokens.css` with their mobile values, then redefined at `--bp-sm` and `--bp-md`: `--gutter`, `--section-pad-y`, `--section-head-gap`, `--nav-height`, `--h1-size`, `--h2-size`. Base and component CSS use these, so they rarely need their own media queries.

---

## 3. Spacing, radius, shadows, motion, breakpoints

### Spacing scale `[est.]`
Normalized from the many raw values in the inspo (4px to 200px). It is roughly a 4/8 scale.

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | 4px | Hairline gaps, label-to-value gap |
| `--space-2` | 8px | Icon gaps, dot gaps, label margin |
| `--space-3` | 12px | Text stack gaps, small padding |
| `--space-4` | 16px | Mobile side gutter (nav), countdown gap (mobile) |
| `--space-5` | 20px | Mobile section side padding |
| `--space-6` | 24px | Grid gap, eyebrow-to-heading gap, tablet side padding |
| `--space-7` | 32px | Card padding, CTA margin under hero text |
| `--space-8` | 40px | Panel padding (large), spacing between card groups |
| `--space-9` | 48px | Heading-to-content (desktop), nav side padding |
| `--space-10` | 56px | Heading-to-content (large sections) |
| `--space-11` | 64px | Desktop side gutter, mobile section vertical padding, two-column gap |
| `--space-12` | 80px | Tablet section vertical padding, footer top padding |
| `--space-13` | 96px | Spare: feature bands |
| `--space-14` | 120px | Desktop section vertical padding |

### Border radius `[read]`
| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 2px | Small bars and dots, hamburger lines |
| `--radius-sm` | 4px | **Cards, panels, countdown cells, images.** This is the default. |
| `--radius-md` | 8px | Large media frames (hero inset image, video) |
| `--radius-lg` | 10px | Modals (if ever needed) |
| `--radius-pill` | 999px | **All buttons**, chips, round icon buttons |

Corners stay nearly square. Pills are the only "soft" shape.

### Borders and focus
| Token | Value | Use |
|---|---|---|
| `--border-hairline` | 1px | All dividers and card borders |
| `--focus-ring-width` | 2px | `:focus-visible` outline |
| `--focus-ring-offset` | 3px | Gap between element and focus outline |

### Shadows `[read]`
The default state is **flat**: hairline borders, no shadows. Shadows appear only on hover and focus, or on floating layers.

| Token | Value | Use |
|---|---|---|
| `--shadow-card-hover` | `0 16px 40px rgba(0, 0, 0, .4)` | Card hover lift |
| `--shadow-raised` | `0 20px 48px rgba(0, 0, 0, .45)` | Featured card hover |
| `--shadow-gold` | `0 12px 32px rgba(233, 183, 117, .35)` | Primary button hover glow |
| `--shadow-gold-soft` | `0 4px 24px rgba(233, 183, 117, .35)` | Resting glow on the hero CTA (optional) |
| `--shadow-modal` | `0 32px 80px rgba(0, 0, 0, .7)` | Modals and overlays |

### Motion `[read]`
- Easing: `--ease-out: cubic-bezier(.2, .7, .2, 1)`.
- Durations: `--dur-fast: .2s` (color, lift), `--dur-base: .3s` (border, shadow), `--dur-slow: .4s` (nav background, drawer slide), `--dur-slower: .6s` (image zoom).
- **Hover lift:** buttons `translateY(-1px)`, cards `translateY(-3px)`. Arrow glyphs slide `translateX(4px)` (3px in small links).
- **Reveal on scroll (optional):** fade in, rise 24px, and blur from 12px to 0 over 1.4s. On page load the hero uses the same effect with staggered delays.
- **CTA pulse (optional):** the inspo pulses a gold ring outward every 2.8s on the RSVP buttons. If we use it, keep it to the single hero CTA. `[adapted]`
- **`prefers-reduced-motion: reduce` disables all of it:** no smooth scroll, reveals, pulse, or lifts. Elements appear in their final state. `[adapted]`

### Breakpoints
The inspo is desktop-first (`max-width: 980px` and `max-width: 640px`). We are **mobile-first**, so the same two thresholds flip to `min-width`. `[read]`, flipped `[adapted]`

| Token | Value | Media query | Range |
|---|---|---|---|
| (base) | — | none | Phones, under 641px |
| `--bp-sm` | 641px | `@media (min-width: 641px)` | Large phones and tablets |
| `--bp-md` | 981px | `@media (min-width: 981px)` | Desktop: full nav and multi-column layouts |
| `--bp-lg` | 1280px | `@media (min-width: 1280px)` | Optional: container is at max width `[est.]` |
| `--bp-tall` | 800px | `@media (min-height: 800px)` | Height guard for sticky columns (program aside) `[adapted]` |

> **Decided:** CSS custom properties **can't be used inside `@media` conditions** (`@media (min-width: var(--bp-md))` doesn't work). The breakpoint tokens in `tokens.css` are the documented source of truth, and every media query writes the literal value with a comment naming the token, e.g. `/* --bp-md */` above `@media (min-width: 981px)`. This is the one approved exception to "only use tokens" (CLAUDE.md rule 2).

### Z-index `[read]`
`--z-nav: 100`, `--z-overlay: 199`, `--z-drawer: 200`, `--z-modal: 1000`.

---

## 4. Layout

### Container
- `--container-max: 1280px`: the content max width, centered. `[read]` from the inspo's inner container. The inspo lets most sections run to the viewport edge minus a 64px gutter. We cap everything at 1280px so ultra-wide screens stay composed. `[adapted]`
- `--measure: 34em` (about 560px): max width for paragraphs and prose. The inspo uses 480–580px. `[read]` range, token `[est.]`

### Section padding and gutters `[read]`
| Viewport | Vertical padding | Side gutter |
|---|---|---|
| Under 641px | 64px (`--space-11`) | 20px (`--space-5`) |
| 641–980px | 80px (`--space-12`) | 24px (`--space-6`) |
| 981px and up | 120px (`--space-14`) | 64px (`--space-11`) |

- Sections are separated by a 1px top border in `--color-border` and share the same `--color-bg`. Alternate with `--color-surface` only for an emphasized band. `[read]`
- Heading block to section content: 24–28px under 641px, 36–40px from 641px, 48–56px from 981px. `[read]`

### Grid behavior (mobile-first)
| Pattern | Under 641px | 641–980px | 981px and up | Gap | Src |
|---|---|---|---|---|---|
| Card grid (announcements) | 1 column | 2 columns | 3 columns | 24px | `[read]` |
| Two-up (text + image) | 1 column, stacked | 1 column, stacked | 2 equal columns, vertically centered | 24 / 28 / 64px | `[read]` |
| Countdown cells (boxed) | 2 × 2 | 4 across | 4 across | 16 / 24 / 24px | `[adapted]` |
| Countdown (compact, hero) | 4 across, equal quarters | 4 across, up to 120px each | Same | 0 (hairlines between) | `[adapted]` |
| Hero event details | Stacked, 40px hairline between | 2 blocks side by side, vertical hairline | Same | 40px padding per block | `[adapted]` |
| Program section | 1 column; timeline `rail | content`, time above title | 1 column; timeline `time | rail | details` | `5fr 7fr`, sticky aside, hairline between | 64px | `[adapted]` |
| Label/value meta rows (`.meta-list`) | Label above value | Same | Same | 8px | `[adapted]` (inspo poster) |
| Footer | 1 column | 2 columns | `2fr 1fr 1fr 1fr` | 24 / 28 / 48px | `[read]` |

### Anchors
Every `<section>` with an `id` gets `scroll-margin-top: var(--nav-height)`. Use `--nav-height: 72px` desktop and 64px mobile. `[est.]` These are estimated from the 14px-padded scrolled nav plus a 40px button. Verify in the browser once the nav exists.

---

## 5. Component patterns

These are structure, states, and responsive behavior only. Each component uses only tokens from sections 1–4.

### 5.1 Navbar (with RSVP button) `[read]`
- **Position:** fixed to the top, full width, `--z-nav`.
- **Initial state** (over the hero): transparent background, transparent bottom border, padding 22px × 48px (desktop).
- **Scrolled state:** JS toggles a class after a small scroll. It gets `--color-overlay`, a 20px backdrop blur, a 1px bottom border in `--color-border`, and padding of 14px × 48px. All of this transitions over `--dur-slow`.
- **Layout:** logo on the left (our own MNHS mark), section links, and the RSVP button on the right, using `space-between`.
- **Links:** nav-link type (14px, 0.18em, uppercase), `--color-text-muted`, with a 32px gap. Hover and active state switch to `--color-text`. The current section can use `aria-current` with a paper color.
- **RSVP button:** visually distinct from the links.
  - A gold pill: `--color-primary` background, `--color-on-primary` text, 14px / 600 / 0.18em uppercase, padding 10px × 20px.
  - Hover: `translateY(-1px)` + `--shadow-gold`.
  - Mobile: 12px / 0.12em, padding 8px × 14px, and it **stays visible in the bar**.
- **Mobile (under 981px):**
  - The links hide and a 40 × 40px hamburger button appears: three 22 × 2px bars with 6px gaps that morph into an ✕ when open.
  - The button opens a right-side drawer: width `min(300px, 85vw)`, background `--color-bg` at 98% opacity, 1px left border.
  - Drawer links are serif *italic* 26px in `--color-text-muted`, with 20px vertical padding and a hairline between each. Hover and active links turn gold.
  - The bottom of the drawer holds a full-width primary RSVP button.
  - A dimmed backdrop (`--color-scrim` + 4px blur) sits behind the drawer. Tapping it closes the drawer.
  - **Tapping any link closes the drawer.** `Esc` closes it too. The toggle button carries `aria-expanded` and `aria-controls`. Body scroll is locked while the drawer is open.
  - Padding: 14px × 20px at 641–980px, 12px × 16px under 641px.
- **Same header on both pages.** On `rsvp.html`, the section links and logo become `index.html#…`.
- **Current page** `[adapted]`: on `rsvp.html` both RSVP pills (bar and drawer) carry `aria-current="page"` and turn **outlined gold**: transparent fill, 1px `--color-primary` border, gold text, no hover lift or glow. It still reads as the RSVP item without acting as a CTA to the page you're on.

### 5.2 Hero `[read]` layout, `[adapted]` content
- **Size:** `min-height: 100vh` (`100svh` on mobile, so the browser chrome doesn't crop it). Full-width background image, `cover`, focal point near the top.
- **Overlays:** top and bottom scrims (§1). Optional grain. The scrims scroll with the hero, not the image, so the center tint stays behind the text. `[adapted]`
- **Pinned image** `[adapted]`: the image stays fixed while the page scrolls. The hero text scrolls normally and the Program section (solid `--color-bg`) slides up over the image. Built with a `position: fixed` image layer sized to `100lvh` and clipped to the hero with `clip-path: inset(0)`, not `background-attachment: fixed`, which iOS Safari ignores. Under `prefers-reduced-motion: reduce`, the image scrolls with the page.
- **Content:** a centered stack, vertically centered in the area below the nav. Order:
  1. Eyebrow: "60th Anniversary Grand Homecoming" (gold, 0.32em).
  2. Preamble: "You are cordially invited to", serif 300 *italic*, `--color-text-muted`, 18px (22px from 641px). 20px below the eyebrow (24px from 641px). `[adapted]`
  3. Display h1: "Alumni *Kumustahay*". The italic gold accent word is **Kumustahay**. 8px below the preamble, so the two read as one phrase. `[adapted]`
  4. Slogan: "Then & Now, Still One MNHS", sans 400 uppercase, 11px (12px from 641px), 0.26em (`--ls-label`), `--color-text-muted`. A short 1px hairline (`--color-border-strong`) on each side: 24px wide with a 12px gap (40px and 16px from 641px). 20px below the h1 (24px from 641px). The spec asked for subtle; it uses muted for contrast over the photo (decision 11). `[adapted]`
  5. **Event details** (`<dl class="event-details">`), `--space-7` below the h1. Two label/value blocks, each centered:
     - Micro label ("When", "Where"), then the serif italic `.value`, then a sub-line (sans 14px, muted). 8px between each.
     - When: "December 30, 2026", with "8:30 AM" as the sub-line. Where: "Mantalongon National High School", with "Sua Campus · Mantalongon, Dalaguete, Cebu" as the sub-line.
     - From 641px: side by side, centered, 40px side padding each, a 1px vertical hairline (`--color-border-strong`) between them.
     - Under 641px: stacked, with a 40px × 1px hairline between them and 20px above and below it.
  6. **Compact countdown** (§5.3), `--space-7` below the details, with a hairline on top and 24px under it.
  7. Primary CTA "RSVP →", `--space-7` below. Hero size: 15px, padding 16px × 40px; under 641px: 12px, padding 12px × 24px. Tracking stays `--ls-button` (snapped from 0.22em, decision 8).
- **Text legibility:** a soft text shadow (`--shadow-text`: `0 4px 32px rgba(0,0,0,.6)`) on the **whole stack**, not just the h1. The button turns it off. Small labels in the hero (micro labels, countdown units) use `--color-text-muted`, not subtle: subtle measured ~3.3:1 over the photo. `[adapted]`
- **Fit:** from eyebrow to button, the stack fits without scrolling at 1440×900, 1366×768, and 1366×650 (a 1366×768 laptop once browser toolbars are counted). On phones the hero may grow taller than the screen.
- **No bottom rail.** Date and venue stay in the centered stack (see §6). The inspo's rail pattern (a hairline-topped strip of label/value pairs) remains available for a future section if needed.

### 5.3 Countdown `[adapted]`
The inspo's countdown is inline and modest: gold italic numerals at 40px (34 and 28 on smaller screens), 9px units at 0.3em, an 18px gap. `[read]` It is **not visible in the screenshots**, because the film is already showing and the site displays "NOW SHOWING" instead.

There are two variants. Both use the same markup (`ul.countdown > li.countdown__cell > .countdown__value + .countdown__unit`).

**Compact (`.countdown--compact`): used in the hero.** The countdown lives inside the hero, not in its own section.
- 4 units (Days, Hrs, Min, Sec), always 4 across. Each is up to 120px wide (`--space-14`); on phones they share the width equally.
- No backgrounds, borders, or radius on the units. A 1px vertical hairline (`--color-border-strong`) between units.
- Numerals: serif 300 *italic*, gold, tabular figures, `--fs-countdown-compact` (`clamp(32px, 4vw, 48px)`), about half the display heading, so it supports the heading instead of competing with it.
- Unit label: micro-label style, 8px below the numeral. In the hero it uses `--color-text-muted` (§5.2).
- In the hero, the wrapper (`.hero__countdown`) draws a hairline across the top of the units, with 24px of space under it.

**Boxed (`.countdown`): styleguide only, not on the homepage.** Kept for a possible future band.
- Cells: `--color-surface` background, 1px `--color-border`, `--radius-sm`, padding 24px (32px from 981px), content centered.
- Numerals: `--fs-countdown: clamp(48px, 8vw, 96px)` `[est.]`. Unit labels: micro-label style, 8px gap.
- Grid: 2 × 2 under 641px (gap 16px), 4 across from 641px (gap 24px). Max width `--countdown-max` (880px), centered.

**Shared behavior:**
- Numerals are always two digits (days can be three). The target time is the single `EVENT_DATE` constant in `js/main.js` (`2026-12-30T08:30:00+08:00`). It ticks every second and recalculates from the clock each time, so it never drifts. Until the script runs, the numerals show "––".
- **Accessibility:** the wrapper has `role="timer"`, `aria-live="off"` (ticks aren't announced), and the static label "Time until the homecoming". The abbreviated units carry hidden full words (Hours, Minutes, Seconds) using `.visually-hidden`.
- **Ended:** once the date passes, the script stops and replaces the units with one line, "The celebration is here", in serif italic gold at `--fs-countdown-compact` with `--ls-countdown-ended` (0.08em) tracking. It matches the numerals' size, so nothing below it moves.

### 5.4 Buttons and arrow CTAs `[read]`
All buttons are pills (`--radius-pill`) with uppercase sans labels. A trailing "→" sits in its own span, so it can slide on hover (`translateX(4px)`, `--dur-fast`).

| Variant | Look | Hover | Use |
|---|---|---|---|
| **Primary** | Gold fill, ink text, 16px / 600 / 0.2em, padding 16px × 24px (13px, 12px × 20px under 641px), 8px gap before the arrow | `translateY(-1px)` + `--shadow-gold` | RSVP: hero, nav, end of page |
| **Ghost** | Transparent, paper text, 1px `--color-border-strong` | Border becomes `--color-text` | Secondary actions |
| **Small ghost link** | Transparent, paper text, 1px `--color-border-strong`, 11px / 500 / 0.18em, padding 8px × 16px, 8px gap | Fills gold, ink text | "Read more →" inside cards |
| **Text arrow link** `[adapted]` | No border or fill. Gold sans uppercase 12px / 0.2em + "→" | Arrow slides; text turns `--color-text` | Inline "See full schedule →" |

- **Focus (all interactive elements)** `[adapted]`: `outline: 2px solid var(--color-primary); outline-offset: 3px;` shown only for `:focus-visible`. On gold buttons, use an outline in `--color-text` so it stays visible against the gold fill. The inspo has no visible focus style, so this is our addition.
- **Disabled** `[read]`: opacity `--opacity-disabled` (.25), `not-allowed` cursor, no hover effects.
- The inspo's resting gold glow and pulse are optional (§3 motion).

### 5.5 Section header (eyebrow + heading) `[read]`
- Eyebrow: gold, 12px (11px under 641px), 0.32em, uppercase, `display: inline-block`.
- Spacing from eyebrow to h2: 24px (12px under 641px).
- h2: serif 300 upright paper with **one** gold italic `<em>` word, e.g. "Latest *Announcements*", "Program of *Activities*".
- An optional supporting paragraph follows: body large, muted, max width `--measure`, 24px below the h2 (20px under 641px). `[est.]`
- Left-aligned by default. Center it only in invitation-like moments (hero, countdown, RSVP intro). `[adapted]`
- Content starts 24–56px below (see §4).

### 5.6 Announcement card `[read]`
- **Container:** `--color-surface`, 1px `--color-border`, `--radius-sm`, padding 32px (24px under 641px), `overflow: hidden`, flex column, so the link can pin to the bottom and equal-height cards line up in the grid.
- **Optional image:** 16:9, bleeding to the card edges (negative margins equal to the padding), with a 1px `--color-border` underneath and 24px below it.
- **Date:** card-date style (11px, 0.26em, gold, uppercase), 12px above the title. Use a `<time datetime>` element.
- **Title:** h3 card title (serif 300, 28px, 1.2). Optionally one italic word, but not required for cards.
- **Description:** body small (14px / 1.7), muted, 12px below the title, grows to fill space.
- **Action:** a small ghost link with arrow, 24px below.
- **Hover:** border becomes `--color-border-gold`, `translateY(-3px)`, `--shadow-card-hover`, image `scale(var(--zoom-media))` (1.04) over `--dur-slower`. The hover state applies to the whole card when it's a single link.
- **Grid:** see §4 (1 → 2 → 3 columns, 24px gap).

### 5.7 Program timeline `[adapted]`
The inspo has no schedule. The layout is adapted from an event-program poster (`/reference/program-inspo.png`): a heading and key facts on the left, a vertical timeline on the right. It's built only from our type, colors and tokens.

**Structure:** `section.program#program` > `.container` > `.program__layout` (`.program__aside` + `.program__schedule`), then `.date-lockup`.

**Layout**
| Viewport | Layout |
|---|---|
| Under 641px | One column: aside, then timeline (rail on the left edge, time above each title), then date lockup. Nothing sticky. |
| 641–980px | One column. The timeline switches to `time | rail | details`. |
| 981px and up | Two columns, `5fr 7fr`, 64px either side of a vertical hairline (the schedule column's left border). |
| 981px and up, and at least 800px tall (`--bp-tall`) | The aside is `position: sticky`, `top: --program-sticky-top` (nav height + 40px). The height guard stops a tall aside from being cut off on short laptop screens. |

**Aside (left column)**
- Section header (§5.5): eyebrow "December 30, 2026" in a `<time>`, h2 "Program of *Activities*".
- **Accent line:** `.accent-rule`, gold, `--rule-accent-w` × `--rule-accent-h` (48 × 2px), 24px below the h2.
- **Intro:** `.section-head__intro` (body large, muted). The copy is marked with a `<!-- [COPY] -->` comment in the HTML.
- **Label/value rows:** `.meta-list`, a `<dl>` with label above value. Each row has a hairline on top and 20px vertical padding, with 8px between lines.
  - Label: micro label (§2).
  - Value: `.value` (serif italic 22 / 26 / 28px). A row can hold several values (the three venues).
  - Sub-line: `.meta-list__sub`, 14px, subtle (e.g. "Wednesday").
  - Prices use tabular figures (`.meta-list__value`).
- **CTA:** primary "RSVP →", 32px below the rows.

**Schedule (right column)**
- "Schedule" micro label, 16px padding and a hairline below.
- **Timeline:** an `<ol class="timeline">` with one `.timeline__item` per program item.
  - **Time:** serif italic 22px (`--fs-xl`), gold, tabular figures (decision 4), inside a `<time datetime>`. Ranges use two `<time>` elements. Text-only times ("Evening") have no `<time>`. From 641px the time column is `max-content` through subgrid, so every dot lines up and times never wrap.
  - **Rail:** a 1px `--color-border` line in its own column, unbroken from the first dot to the last.
  - **Dot:** `--timeline-dot` (8px), gold, centered on the time's first line.
  - **Title:** `h3.timeline__title`, sans 14px, medium, uppercase, 0.18em (`--ls-nav`), paper.
  - **Venue:** micro label under the title, 8px gap. Every item shows where it happens.
  - **Sub-items:** `ul.timeline__list`, 14px / 1.7, muted, each led by a 12px hairline dash in `--color-border-strong`.
  - **Spacing:** 24px above each item; 24px padding and a hairline under the details column only, so the hairline never crosses the rail. The last item has no hairline.
- **Finale** (`.timeline__item--finale`): the dot gets a `--timeline-dot-ring` (4px) halo in `--color-border-gold`, and the venue line turns gold. Nothing else changes.

**Date lockup** (`.date-lockup`)
- Centered at the bottom of the section, with a full-width hairline above and `--section-head-gap` of space on both sides of it.
- "30": serif 300 italic, gold, `--fs-date-lockup` (`clamp(96px, 20vw, 176px)`).
- Diagonal: a 1px `--color-border-strong` line, `--lockup-slash-h` long (0.8 × the numeral size), rotated `--lockup-slash-angle` (20deg).
- "December" over "2026" in eyebrow style, 8px apart.
- Decorative only: `aria-hidden="true"`, because the date is already in the eyebrow and the Date row.

### 5.8 Footer `[read]`
- **Container:** `--color-bg-deep`, 1px top `--color-border`. Padding: 56px top, 24px sides, 24px bottom under 981px; 80px × 64px × 32px from 981px.
- **Grid:** see §4 (1 → 2 → `2fr 1fr 1fr 1fr`). There is 56px of padding below it, then a hairline.
  - **Brand column:** our logo (max width about 100px), then a 15px / 1.7 subtle blurb (max 360px) 16px below. Example: "MNHS Grand Alumni Homecoming · [EVENT DATE] · [VENUE]".
  - **Link columns:** footer heading (13px / 600 / 0.32em, paper), 16px below it a list of 15px subtle links with 10px between items. Hover turns paper. Columns: "Explore" (Home, Program, Announcements, RSVP) and "Connect" (social and contact placeholders).
- **Baseline row:** 28px above, legal style (11px, 0.18em, uppercase, `--color-text-subtle`, which is lifted from the inspo's failing .35). © line on the left, small links on the right. Stacked and centered with a 12px gap under 981px.
- **Same footer on both pages.** On `rsvp.html` the links point to `index.html#…` and the RSVP link carries `aria-current="page"` (paper color).
- **As built** (snapped to tokens, decision 8): side padding uses `--gutter`; link gap `--space-3` (inspo 10px); grid gap `--space-6` until 981px (inspo 28px at tablet); baseline `--space-7` above (inspo 28px); logo width `--space-13` (96px). From 641px the brand spans both columns; from 981px the two link columns sit in the last two of the four tracks. Column headings are `h2.site-footer__heading`. Connect links are `[PLACEHOLDER]`s.

### 5.9 Form fields `[adapted]`
The inspo has no forms. Fields follow the ink-and-hairline look: a dark well on the surface panel, nearly square corners, no shadows.

**Markup:** `.form` (grid, `--space-7` between fields) > `.field` > `label.field__label` + `input.field__input` + `p.field__error[hidden]`. An optional `p.field__hint` sits between the label and the input.

| Part | Spec |
|---|---|
| Label (and legend) | Meta-label type: sans 500, 12px (`--fs-sm`), `--ls-label`, uppercase, **muted** (subtle is too faint for labels). Always visible; never placeholder-only. `--space-2` above the input. |
| Input | `--color-bg` well, 1px `--color-border-strong`, `--radius-sm`, min height `--field-height` (48px), padding 12 × 16px, 16px text (stops iOS zoom), `color-scheme: dark`. Autofill is kept on the ink well. |
| Short input | `.field__input--short`: max width `--space-14`, for numbers (companions). |
| Hint | 14px, subtle. Linked with `aria-describedby`. |
| Hover | Border becomes `--color-text-muted`. |
| Focus | Border becomes `--color-primary`, plus the standard gold `:focus-visible` ring. |
| Invalid | `aria-invalid="true"` → border `--color-error`. Error text below: 13px (`--fs-sm-plus`), `--color-error`, `--space-2` gap. |
| Form alert | `.form__alert` (`role="alert"`) above the submit button: 14px, `--color-error` text and 1px border, `--radius-sm`, centered. For request failures, not field errors. |
| Submit | Full-width primary button (`.form__submit`). While sending: disabled, label "Sending…", arrow hidden. |

**Behavior (js/rsvp.js):**
- The form has `novalidate`; validation runs on submit. Each invalid field gets `aria-invalid` and its error id added to `aria-describedby` (after any hint id), and focus moves to the first invalid field. Fields that have shown an error re-check themselves as they change, so errors clear as soon as they're fixed.
- Error messages are empty and `hidden` while the field is valid, so screen readers never read stale text.
- `[hidden]` always wins over component `display` values (base.css).

### 5.10 Radio pills `[adapted]`
Pill-shaped choices for a short, either/or question (e.g. "Joyfully accepts" / "Regretfully declines"). Styled like a printed reply card.

**Markup:** `fieldset.field.choices` > `legend.field__label` + `.choices__options` > `label.choice` > `input.choice__input[type=radio]` + `span.choice__indicator` + `span.choice__text`, then the group's `p.field__error`.

- **Real radios:** the native input covers the whole pill at opacity 0. Clicking, tapping, Tab into the group, arrow keys, and screen readers all use the native control.
- **Pill:** `--radius-pill`, 1px `--color-border-strong`, min height `--field-height`, padding 12 × 20px. Label is serif 300 *italic* 22px (`--fs-xl`), muted.
- **Indicator:** a `--choice-indicator` (16px) hairline ring on the left, with a gold dot that scales in when checked, so the state doesn't depend on color alone.
- **Hover:** border muted, text paper.
- **Checked:** `--color-primary` border and ring, `--color-primary-tint` background, paper text, gold dot.
- **Focus:** the gold focus ring is drawn on the pill (`:has(:focus-visible)`), since the input itself is invisible.
- **Invalid:** border `--color-error`. `aria-invalid` and `aria-describedby` go on each radio, and focus moves to the first radio.
- **Layout:** stacked under 641px; two equal columns from 641px, `--space-3` gap.

### 5.11 RSVP page `[adapted]`
**Structure:** header (RSVP pill current) → `section.rsvp` > `.container` > centered `.section-head` + `.rsvp-panel` → footer.

- **No hero.** The section clears the fixed bar itself: top padding `--nav-height + --section-pad-y`, bottom `--section-pad-y`.
- **Intro** (`.section-head--center`): eyebrow "Alumni Kumustahay · December 30, 2026", h1 "Kindly *Respond*" (page-title size), and the muted line "Please let us know if you'll be joining us by December 20, 2026."
- **Panel** (`.rsvp-panel`): `--color-surface`, 1px `--color-border`, `--radius-sm`, max width `--panel-max` (560px), centered; padding `--space-6` (`--space-8` from 641px).
- **Fields:** Full Name (text, required) → Will you be attending? (radio pills, required) → Number of Companions (0–5, default 0, shown only when accepting; "0" is sent when declining) → a visually hidden honeypot ("website", `tabindex="-1"`, `autocomplete="off"`, wrapper `aria-hidden`) → alert → "Send RSVP →".
- **Messages** (`.rsvp-message`, which replaces the form inside the panel): centered stack, `--space-4` gap — a short gold `.accent-rule`, an h2 at `--fs-lead` with one gold italic accent word, a muted 18px line, and optionally an eyebrow.
  - Accepted: "Thank you, *[Name]*." / "We can't wait to see you." / eyebrow "Party of N" when companions > 0 (N = companions + 1).
  - Declined: "Thank you, *[Name]*." / "You'll be missed."
  - Closed: "RSVPs are now *closed*." / "We'll see you on December 30!"
  - After a submit the message has `role="status"` and `tabindex="-1"` and receives focus. The closed message shown on page load takes no focus. The name is inserted as text, never HTML.
- **Constants** (top of `js/rsvp.js`): `RSVP_ENDPOINT` (Apps Script web app URL) and `RSVP_DEADLINE` (`2026-12-20T23:59:59+08:00`). The deadline is checked against the visitor's clock on every page load and again on submit.
- **Request:** `fetch` POST with a `URLSearchParams` body and no custom headers (a "simple" request, so no CORS preflight). Fields: `fullName`, `attending` (Yes/No), `companions`, `website`. Expects `{ ok: true }` or `{ ok: false, error }`; anything else, a network failure, or non-JSON shows the form alert and keeps the form filled in. A filled honeypot shows the normal thank-you and sends nothing.

---

## 6. Decisions

1. **Breakpoints in media queries.** Literal values with a comment naming the token are approved everywhere (§3, CLAUDE.md rule 2).
2. **Hero layout.** Centered stack: eyebrow, preamble, h1, slogan, event details (When / Where label-value blocks), compact countdown, RSVP button. No bottom rail (§5.2).
3. **Hero copy and accent word.** Eyebrow "60th Anniversary Grand Homecoming", preamble "You are cordially invited to", heading "Alumni *Kumustahay*" (accent word **Kumustahay**), slogan "Then & Now, Still One MNHS".
4. **Program times.** Gold serif italic, tabular figures (§5.7).
5. **Countdown size.** The hero uses the compact countdown at `clamp(32px, 4vw, 48px)`. The boxed size (`clamp(48px, 8vw, 96px)`) stays an estimate, since the boxed variant isn't used on the homepage.
6. **Extra tokens kept.** `--border-hairline`, `--focus-ring-width`, `--focus-ring-offset`, `--font-feature-tnum`.
   Added during the styleguide build: `--lh-lead: 1.25`, `--countdown-max: 880px`, `--opacity-disabled: .25`, `--zoom-media: 1.04`.
7. **Inter italic 400** is loaded, so `<em>` in body text renders as true italic.
8. **Snapped to the token scale.** Where the inspo's raw values fell between tokens, we use the nearest existing token: value text 28px on desktop, card padding 24px on mobile, and the button and gap sizes in §5.4–5.7. The specs above already reflect this.
9. **Countdown "ended" line.** It uses `--fs-countdown-compact` instead of a separate 40px size, so it takes up the same height as the numerals it replaces. Tracking: `--ls-countdown-ended` (0.08em).
10. **Countdown lives in the hero.** There is no separate countdown section. Homepage order: Hero (with countdown) → Program → Announcements → Footer.
11. **Hero legibility.** Center scrim at .70 with an `80% 70%` ellipse, `--shadow-text` on the whole hero stack, and muted (not subtle) small labels and slogan. Measured median contrast is at least 4.8:1 for every small line at 1440×900, 1366×768 and 390px.
12. **Program timeline replaces the panel.** The old program panel (one surface card per day) is retired. §5.7 is now a two-column aside + timeline with a date lockup. Section `#program`, nav label "Program". New tokens: `--rule-accent-w`, `--rule-accent-h`, `--timeline-dot`, `--timeline-dot-ring`, `--fs-date-lockup`, `--lockup-slash-h`, `--lockup-slash-angle`, `--program-sticky-top`, `--bp-tall`.
13. **RSVP page and forms.** Built `rsvp.html` (§5.11) with form fields (§5.9) and radio pills (§5.10), plus the footer (§5.8) on both pages. The current-page RSVP pill is outlined gold (§5.1). New tokens: `--color-error`, `--color-primary-tint`, `--panel-max`, `--field-height`, `--choice-indicator`.
