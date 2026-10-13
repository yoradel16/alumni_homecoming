/**
 * MNHS Grand Alumni Homecoming: RSVP receiver
 * ===========================================
 * Receives the RSVP form from rsvp.html and appends one row per response
 * to the "RSVPs" tab of the Google Sheet this script is attached to.
 *
 * How it's used:
 *   1. Paste this whole file into Extensions → Apps Script (from the Sheet).
 *   2. Deploy it as a web app (Execute as: Me, Who has access: Anyone).
 *   3. Paste the web app URL into RSVP_ENDPOINT in js/rsvp.js.
 * Full checklist: README.md → "RSVP setup".
 *
 * What the website sends (a normal form POST, fields in e.parameter):
 *   fullName    the guest's name
 *   attending   "Yes" or "No"
 *   companions  "0" to "5" (always "0" when attending is "No")
 *   website     the hidden honeypot field; people leave it empty, bots fill it
 *
 * What this script answers (JSON):
 *   { "ok": true }                        saved (or silently ignored as spam)
 *   { "ok": false, "error": "<code>" }    not saved; codes are listed below
 *
 * Error codes:
 *   "closed"              received after the RSVP deadline
 *   "invalid_name"        name missing, or longer than 100 characters
 *   "invalid_attending"   attending isn't exactly "Yes" or "No"
 *   "invalid_companions"  companions isn't a whole number from 0 to 5
 *   "busy"                another response was being saved; try again
 *   "server"              something unexpected went wrong (see Executions)
 */


/* --------------------------------------------------------------------------
   Settings: the only lines you should need to change
   -------------------------------------------------------------------------- */

/** Name of the tab (at the bottom of the Sheet) that receives the rows. */
var SHEET_NAME = 'RSVPs';

/**
 * Last moment to accept an RSVP: Philippine time (+08:00).
 * Keep this in sync with RSVP_DEADLINE in js/rsvp.js.
 */
var RSVP_DEADLINE = '2026-12-20T23:59:59+08:00';

/** Time zone used to write the Timestamp column. */
var TIME_ZONE = 'Asia/Manila';

/** Limits on what the form may send. */
var MAX_NAME_LENGTH = 100;
var MAX_COMPANIONS = 5;

/** How long to wait (milliseconds) for another save to finish. */
var LOCK_TIMEOUT_MS = 10000;


/* --------------------------------------------------------------------------
   Web app entry points
   -------------------------------------------------------------------------- */

/**
 * Runs for every RSVP the website sends (an HTTP POST to the web app URL).
 */
function doPost(e) {
  try {
    // e.parameter holds the form fields; guard in case it's missing
    var params = (e && e.parameter) || {};

    // 1. Honeypot: a real person never sees the "website" field, so anything
    //    in it means a bot. Pretend it worked, so the bot learns nothing,
    //    and write nothing.
    if (String(params.website || '').trim() !== '') {
      return jsonResponse({ ok: true });
    }

    // 2. Deadline: checked on Google's clock, so it can't be bypassed by
    //    a visitor whose computer clock is wrong.
    if (new Date().getTime() > new Date(RSVP_DEADLINE).getTime()) {
      return jsonResponse({ ok: false, error: 'closed' });
    }

    // 3. Validate and clean up the fields.
    var result = validate(params);
    if (result.error) {
      return jsonResponse({ ok: false, error: result.error });
    }

    // 4. Save the row.
    return saveRsvp(result.data);
  } catch (err) {
    // Shows up under Executions in the Apps Script editor
    console.error('RSVP failed:', err);
    return jsonResponse({ ok: false, error: 'server' });
  }
}

/**
 * Runs when someone opens the web app URL in a browser. Not used by the
 * form; it's just a quick way to check the deployment is live.
 */
function doGet() {
  return jsonResponse({ ok: true, service: 'MNHS RSVP' });
}


/* --------------------------------------------------------------------------
   Validation
   -------------------------------------------------------------------------- */

/**
 * Checks the form fields. Returns either { error: "<code>" } or
 * { data: { fullName, attending, companions } } with clean values.
 */
function validate(params) {
  // Name: required, trimmed, at most 100 characters.
  // Runs of spaces inside the name are collapsed to one.
  var fullName = String(params.fullName || '').trim().replace(/\s+/g, ' ');
  if (fullName === '' || fullName.length > MAX_NAME_LENGTH) {
    return { error: 'invalid_name' };
  }

  // Attending: exactly "Yes" or "No" (case-sensitive, as the form sends it).
  var attending = String(params.attending || '');
  if (attending !== 'Yes' && attending !== 'No') {
    return { error: 'invalid_attending' };
  }

  // Companions: a whole number from 0 to 5, digits only (no "2.5", "-1",
  // or "3 people"). Always 0 for guests who decline, whatever was sent.
  var companions = 0;
  if (attending === 'Yes') {
    var raw = String(params.companions == null ? '' : params.companions).trim();
    if (!/^\d+$/.test(raw)) {
      return { error: 'invalid_companions' };
    }
    companions = parseInt(raw, 10);
    if (companions < 0 || companions > MAX_COMPANIONS) {
      return { error: 'invalid_companions' };
    }
  }

  return {
    data: {
      fullName: fullName,
      attending: attending,
      companions: companions,
    },
  };
}


/* --------------------------------------------------------------------------
   Writing to the Sheet
   -------------------------------------------------------------------------- */

/**
 * Appends one row:
 *   Timestamp | Full Name | Attending | Companions | Total Headcount
 * A script lock makes sure two guests submitting at the same moment
 * can't write over each other.
 */
function saveRsvp(data) {
  var lock = LockService.getScriptLock();

  // Wait up to 10 seconds for any other save to finish
  if (!lock.tryLock(LOCK_TIMEOUT_MS)) {
    return jsonResponse({ ok: false, error: 'busy' });
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('No tab named "' + SHEET_NAME + '". Rename the tab or change SHEET_NAME.');
    }

    // The guest plus their companions; nobody is counted for a "No"
    var headcount = data.attending === 'Yes' ? 1 + data.companions : 0;

    sheet.appendRow([
      Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss'),
      safeText(data.fullName),
      data.attending,
      data.companions,
      headcount,
    ]);

    // Write now, before the lock is released
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Sheets treats text starting with = + - or @ as a formula. Putting an
 * apostrophe in front stores it as plain text instead (the apostrophe
 * isn't shown in the cell). Stops a "name" like =IMPORTXML(...) from
 * running inside your Sheet.
 */
function safeText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}


/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

/** Wraps an object as a JSON response for the website. */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/* --------------------------------------------------------------------------
   Manual test: run this from the editor (select "testSubmission" in the
   toolbar, then Run). The first run asks you to authorize the script.
   It adds one row named "TEST: delete me". Delete that row afterwards.
   -------------------------------------------------------------------------- */
function testSubmission() {
  var response = doPost({
    parameter: { fullName: 'TEST: delete me', attending: 'Yes', companions: '2', website: '' },
  });
  console.log(response.getContent()); // expect {"ok":true}, or "closed" after the deadline
}
