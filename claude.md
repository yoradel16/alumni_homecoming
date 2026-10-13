# MNHS Grand Alumni Homecoming — Project Guide

## Project brief
An information website for MNHS's 60th anniversary grand alumni homecoming. It is a simple, static info site. An RSVP feature may grow later (e.g., a Google Form embed now, a native form later), so keep RSVP self-contained and easy to swap.

The homepage should feel like an **invitation**: elegant, celebratory, and minimal.

## Tech stack
- Plain **HTML, CSS, and vanilla JavaScript** only.
- No frameworks, build tools, CSS libraries, or JS libraries unless I explicitly approve them first.
- Fonts via Google Fonts: **Cormorant** (headings) and **Inter** (body).

## Pages
The site has only **two pages**:
1. **Home** (`index.html`): a single-page info site made of sections
2. **RSVP** (`rsvp.html`): the main call to action

### Home sections (in order)
Each section has an `id` so the navbar can link to it with anchor links.
1. **Hero** (`#home`): a full-width hero image with invitation-style text:
   - Eyebrow/label (small, uppercase, letter-spaced): "60th Anniversary Grand Homecoming"
   - Preamble (small serif italic): "You are cordially invited to"
   - Main heading: **"Alumni Kumustahay"**, with *Kumustahay* as the gold italic accent word
   - Slogan (small uppercase sans, short hairlines on both sides): "Then & Now, Still One MNHS"
   - Event details as When / Where label-value blocks: December 30, 2026, 8:30 AM · Mantalongon National High School, Sua Campus, Mantalongon, Dalaguete, Cebu
   - Compact countdown: Days / Hrs / Min / Sec to the event, in vanilla JS. The target date is one clearly labeled constant (`EVENT_DATE` in `js/main.js`).
   - Primary button: "RSVP →" (links to `rsvp.html`)
2. **Program** (`#program`): "Program of *Activities*", the event schedule as a timeline (design-system.md §5.7)
3. **Announcements** (`#announcements`)
4. **Footer**

There is no separate countdown section; it lives in the hero (design-system.md §5.3, decision 10).

More sections get added one at a time, as I request them.

### Navigation
- Links:
  - Home → `#home`
  - Program → `#program`
  - Announcements → `#announcements`
  - **RSVP** → `rsvp.html`, styled as a highlighted button (the primary CTA) and visually distinct from the other links
- On `rsvp.html`, the section links point back to the homepage sections (e.g. `index.html#announcements`).
- Use smooth scrolling for anchor links, respecting `prefers-reduced-motion`. Account for the header height so section headings aren't hidden under a sticky nav (use `scroll-margin-top`).
- Mobile: a compact header with a simple menu toggle written in vanilla JS. The menu closes after a link is tapped.
- Use the same header and footer on both pages.

## Design direction
- **Inspiration:** https://tayosawakas.com/. Match its color palette, typography feel, and design system. Use our own content, images, and logo; never copy their assets, logos, or text.
- Patterns to borrow from the inspo site:
  - Small uppercase, letter-spaced eyebrow labels above section headings
  - Serif headings with **one italic accent word** (e.g. "Program of *Activities*")
  - Text-style CTAs with a trailing arrow ("RSVP →")
  - Prominent countdown blocks with large numerals and small unit labels
  - Clean, airy sections with generous whitespace
- Overall feel: **clean lines, minimalism, elegant and invitation-like**. Use thin dividers and borders, and keep decoration restrained.
- All design decisions live in `design-system.md`. If it doesn't exist yet, create it first by analyzing the inspo site (and anything in `/reference`) before writing any page code.

## Design tokens
- All colors, font families, font sizes, spacing, radius, shadows, and breakpoints are defined as CSS custom properties in `css/tokens.css`.
- **Only use the design tokens.** Never hard-code a hex value, px font size, or spacing value in component or page CSS. If a needed value is missing, propose a new token and ask before adding it.

## File structure
```
/index.html          — Home (hero with countdown, program, announcements)
/rsvp.html           — RSVP page
/css/tokens.css      — design tokens only
/css/base.css        — reset, typography, layout primitives
/css/components.css  — nav, buttons, cards, countdown, footer, etc.
/js/main.js          — nav toggle, countdown, smooth scroll
/assets/images/
/reference/          — inspiration screenshots (not shipped)
/design-system.md
```

## Rules
1. **Mobile-first.** Write base styles for small screens, then layer on `min-width` media queries using the breakpoint tokens.
2. **Only use the design tokens.** No hard-coded values.
   - **Exception: media queries.** CSS variables can't be used in `@media` conditions, so media queries use the literal breakpoint value with a comment naming its token (e.g. `/* --bp-md */` above `@media (min-width: 981px)`). Approved everywhere.
3. **No new libraries without asking.** This includes CDN scripts, icon packs, and CSS frameworks.
4. **One section at a time.** Build only the section I ask for, then stop and let me review before moving on.
5. Keep HTML semantic and accessible:
   - Use proper heading order, alt text on images, and visible focus states.
   - Text must meet sufficient color contrast.
   - Respect `prefers-reduced-motion`.
6. Keep JS small, readable, and free of dependencies. Comment anything non-obvious.
7. When unsure about content (dates, venue, copy), use a clearly marked placeholder like `[EVENT DATE]` instead of inventing details.