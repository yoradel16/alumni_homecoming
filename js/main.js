/* ==========================================================================
   MNHS Grand Alumni Homecoming — main.js
   Navbar: scrolled state and mobile drawer. No dependencies.
   Smooth scrolling is handled in CSS (base.css), so it respects
   prefers-reduced-motion without any JS.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Scrolled navbar
     ------------------------------------------------------------------------ */
  const SCROLL_OFFSET = 24; // px scrolled before the bar gets its background

  const header = document.querySelector('[data-site-header]');

  if (header) {
    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > SCROLL_OFFSET);
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // the page may load already scrolled (reload, #hash)
  }

  /* ------------------------------------------------------------------------
     Mobile drawer
     ------------------------------------------------------------------------ */
  const toggle = document.querySelector('[data-nav-toggle]');
  const drawer = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
  const scrim = document.querySelector('[data-nav-scrim]');

  if (!toggle || !drawer) return;

  const root = document.documentElement;
  const desktop = window.matchMedia('(min-width: 981px)'); // --bp-md

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  // While open, everything behind the drawer is made inert, so keyboard
  // and screen-reader users stay inside the bar and the drawer.
  const background = () =>
    Array.from(document.body.children).filter(
      (el) => !el.matches('[data-site-header], #nav-drawer, [data-nav-scrim], script')
    );

  function setOpen(open, returnFocus) {
    toggle.setAttribute('aria-expanded', String(open));
    root.classList.toggle('nav-open', open); // also locks page scroll (CSS)
    background().forEach((el) => { el.inert = open; });

    if (open) {
      const firstLink = drawer.querySelector('a');
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen(), true));

  if (scrim) scrim.addEventListener('click', () => setOpen(false, true));

  // Tapping any link closes the drawer; the browser then follows the link
  drawer.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false, false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false, true);
  });

  // The drawer doesn't exist at desktop widths; close it if the window grows
  desktop.addEventListener('change', (event) => {
    if (event.matches && isOpen()) setOpen(false, false);
  });
})();

/* ==========================================================================
   Countdown (design-system §5.3, compact variant in the hero)
   ========================================================================== */

(function () {
  'use strict';

  /* EVENT DATE: change this one line to move the countdown.
     ISO 8601 with the Philippine time zone offset (+08:00). */
  const EVENT_DATE = '2026-12-30T08:30:00+08:00';

  const ENDED_TEXT = 'The celebration is here';

  const root = document.querySelector('[data-countdown]');
  if (!root) return;

  const target = new Date(EVENT_DATE).getTime();
  const fields = {
    days: root.querySelector('[data-countdown-days]'),
    hours: root.querySelector('[data-countdown-hours]'),
    minutes: root.querySelector('[data-countdown-minutes]'),
    seconds: root.querySelector('[data-countdown-seconds]'),
  };

  const pad = (n) => String(n).padStart(2, '0');
  let timer;

  function showEnded() {
    clearInterval(timer);
    // Not a timer anymore: drop the role and label, keep the line readable
    root.removeAttribute('role');
    root.removeAttribute('aria-label');
    root.innerHTML = '';
    const line = document.createElement('p');
    line.className = 'countdown__ended';
    line.textContent = ENDED_TEXT;
    root.appendChild(line);
  }

  function tick() {
    // Recompute from the clock every time, so the count never drifts
    const remaining = Math.floor((target - Date.now()) / 1000);
    if (remaining <= 0) {
      showEnded();
      return;
    }

    fields.days.textContent = pad(Math.floor(remaining / 86400));
    fields.hours.textContent = pad(Math.floor((remaining % 86400) / 3600));
    fields.minutes.textContent = pad(Math.floor((remaining % 3600) / 60));
    fields.seconds.textContent = pad(remaining % 60);
  }

  tick();
  if (target > Date.now()) timer = setInterval(tick, 1000);
})();
