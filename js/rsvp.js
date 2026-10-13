/* ==========================================================================
   MNHS Grand Alumni Homecoming — rsvp.js
   RSVP form (design-system §5.9–5.11): deadline check, validation, and
   submission. Loaded only on rsvp.html. No dependencies.
   ========================================================================== */

(function () {
  'use strict';

  /* RSVP ENDPOINT: paste the Google Apps Script web app URL (ends in /exec).
     It must answer with JSON: { ok: true } or { ok: false, error }.
     Setup steps: README.md → "RSVP setup"; script: apps-script/Code.gs. */
  const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw1-ZKK3iIneTqYapzjnX9acyUw4BOBEEkEu5A_5zMws9QC2diIDWdjsRnJwLBOVxtr/exec';

  /* RSVP DEADLINE: the last moment to respond. ISO 8601 with the Philippine
     time zone offset (+08:00). Checked against the visitor's clock on every
     page load, and again on submit (for tabs left open past the deadline).
     Keep in sync with RSVP_DEADLINE in apps-script/Code.gs. */
  const RSVP_DEADLINE = '2026-12-20T23:59:59+08:00';

  const MAX_COMPANIONS = 5;''

  const ERRORS = {
    fullName: 'Please enter your full name.',
    attending: 'Please let us know if you’ll be attending.',
    companions: `Please enter a number from 0 to ${MAX_COMPANIONS}.`,
    submit: 'Something went wrong. Please try again.',
  };

  const panel = document.querySelector('[data-rsvp]');
  const form = panel && panel.querySelector('[data-rsvp-form]');
  if (!form) return;

  const deadline = new Date(RSVP_DEADLINE).getTime();
  const isClosed = () => Date.now() > deadline;

  const nameInput = form.elements.fullName;
  const radios = Array.from(form.querySelectorAll('input[name="attending"]'));
  const companionsField = form.querySelector('[data-rsvp-companions]');
  const companionsInput = form.elements.companions;
  const honeypot = form.elements.website;
  const alertBox = form.querySelector('[data-rsvp-alert]');
  const submitButton = form.querySelector('[data-rsvp-submit]');
  const submitLabel = form.querySelector('[data-rsvp-submit-label]');
  const submitArrow = form.querySelector('[data-rsvp-submit-arrow]');
  const defaultLabel = submitLabel.textContent;

  const attendingValue = () => {
    const checked = radios.find((radio) => radio.checked);
    return checked ? checked.value : '';
  };

  /* ------------------------------------------------------------------------
     Messages: thank-you and closed. Built with textContent, never
     innerHTML, because the guest's name is user input.
     ------------------------------------------------------------------------ */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // Heading with one gold italic accent word: "<before><em>accent</em>."
  function title(before, accent) {
    const h2 = el('h2', 'rsvp-message__title', before);
    h2.append(el('em', '', accent), '.');
    return h2;
  }

  // announce: true moves focus to the message and makes it a live region
  function showMessage(heading, lines, announce) {
    const message = el('div', 'rsvp-message');
    message.append(el('span', 'accent-rule'), heading);
    message.firstChild.setAttribute('aria-hidden', 'true');
    lines.forEach((line) => message.append(line));

    if (announce) {
      message.setAttribute('role', 'status');
      message.tabIndex = -1;
    }

    panel.replaceChildren(message);
    if (announce) message.focus();
  }

  function showClosed(announce) {
    showMessage(
      title('RSVPs are now ', 'closed'),
      [el('p', 'rsvp-message__text', 'We’ll see you on December 30!')],
      announce
    );
  }

  function showThanks(data) {
    const lines = [];
    if (data.attending === 'Yes') {
      lines.push(el('p', 'rsvp-message__text', 'We can’t wait to see you.'));
      const companions = Number(data.companions);
      if (companions > 0) lines.push(el('p', 'eyebrow', `Party of ${companions + 1}`));
    } else {
      lines.push(el('p', 'rsvp-message__text', 'You’ll be missed.'));
    }
    showMessage(title('Thank you, ', data.fullName), lines, true);
  }

  /* ------------------------------------------------------------------------
     Deadline: checked on every page load, so a cached page still closes.
     ------------------------------------------------------------------------ */
  if (isClosed()) {
    showClosed(false);
    return;
  }

  /* ------------------------------------------------------------------------
     Companions: only asked when accepting. Its value is kept if the guest
     switches back and forth, but "0" is sent whenever they decline.
     ------------------------------------------------------------------------ */
  function syncCompanions() {
    const accepting = attendingValue() === 'Yes';
    companionsField.hidden = !accepting;
    if (!accepting) setError(checks.companions, '');
  }

  /* ------------------------------------------------------------------------
     Validation. Each check owns its inputs and error element. While a
     field is invalid it gets aria-invalid and its error id is appended to
     aria-describedby (after any hint that is already there).
     ------------------------------------------------------------------------ */
  const checks = {
    fullName: {
      inputs: [nameInput],
      error: document.getElementById('rsvp-name-error'),
      validate: () => (nameInput.value.trim() ? '' : ERRORS.fullName),
    },
    attending: {
      inputs: radios,
      error: document.getElementById('rsvp-attending-error'),
      validate: () => (attendingValue() ? '' : ERRORS.attending),
    },
    companions: {
      inputs: [companionsInput],
      error: document.getElementById('rsvp-companions-error'),
      validate: () => {
        if (attendingValue() !== 'Yes') return '';
        // An unparseable number input reports value "", which fails here too
        const raw = companionsInput.value.trim();
        const n = Number(raw);
        return raw !== '' && Number.isInteger(n) && n >= 0 && n <= MAX_COMPANIONS ? '' : ERRORS.companions;
      },
    },
  };

  // Remember each input's own aria-describedby (e.g. a hint) before we add to it
  Object.values(checks).forEach((check) => {
    check.inputs.forEach((input) => {
      input.dataset.describedby = input.getAttribute('aria-describedby') || '';
    });
  });

  function setError(check, message) {
    check.error.textContent = message;
    check.error.hidden = !message;
    check.inputs.forEach((input) => {
      const ids = [input.dataset.describedby, message ? check.error.id : ''].filter(Boolean).join(' ');
      if (ids) input.setAttribute('aria-describedby', ids);
      else input.removeAttribute('aria-describedby');
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    });
  }

  const run = (check) => {
    const message = check.validate();
    setError(check, message);
    return !message;
  };

  // Returns the first invalid check, or null when everything passes
  function validateAll() {
    let firstInvalid = null;
    Object.values(checks).forEach((check) => {
      if (!run(check) && !firstInvalid) firstInvalid = check;
    });
    return firstInvalid;
  }

  // Once a field has shown an error, re-check it as the guest fixes it
  function revalidate(event) {
    Object.values(checks).forEach((check) => {
      if (!check.error.hidden && check.inputs.includes(event.target)) run(check);
    });
  }

  form.addEventListener('input', revalidate);
  form.addEventListener('change', (event) => {
    if (event.target.name === 'attending') syncCompanions();
    revalidate(event);
  });

  // The browser may restore a checked radio on reload or back/forward
  syncCompanions();

  /* ------------------------------------------------------------------------
     Submit
     ------------------------------------------------------------------------ */
  let sending = false;

  function setSending(on) {
    sending = on;
    submitButton.disabled = on;
    submitLabel.textContent = on ? 'Sending…' : defaultLabel;
    submitArrow.hidden = on;
  }

  function showSubmitError() {
    alertBox.hidden = false;
    // Set the text after unhiding, so role="alert" announces it
    alertBox.textContent = ERRORS.submit;
  }

  function hideSubmitError() {
    alertBox.hidden = true;
    alertBox.textContent = '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    if (isClosed()) {
      showClosed(true);
      return;
    }

    hideSubmitError();

    const invalid = validateAll();
    if (invalid) {
      invalid.inputs[0].focus();
      return;
    }

    const attending = attendingValue();
    const data = {
      fullName: nameInput.value.trim(),
      attending,
      companions: attending === 'Yes' ? String(Number(companionsInput.value)) : '0',
      website: honeypot.value,
    };

    // Honeypot filled: almost certainly a bot. Look successful, send nothing.
    if (data.website) {
      showThanks(data);
      return;
    }

    if (RSVP_ENDPOINT.startsWith('[')) {
      console.warn('RSVP_ENDPOINT is still the placeholder. Paste the Apps Script URL in js/rsvp.js.');
      showSubmitError();
      return;
    }

    setSending(true);
    try {
      // URLSearchParams body + no custom headers = a "simple" request:
      // no CORS preflight, which Apps Script web apps can't answer
      const response = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams(data),
      });
      const result = await response.json();
      // The server's deadline is the one that counts: if it says closed
      // (e.g. the visitor's clock is behind), show the closed message
      if (result && result.ok === false && result.error === 'closed') {
        showClosed(true);
        return;
      }
      if (!result || result.ok !== true) {
        throw new Error((result && result.error) || 'The RSVP endpoint did not confirm.');
      }
      showThanks(data);
    } catch (error) {
      console.warn('RSVP failed:', error);
      setSending(false);
      showSubmitError();
    }
  });
})();
