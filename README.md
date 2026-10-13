# MNHS Grand Alumni Homecoming

A static site (plain HTML, CSS and JavaScript) for the MNHS 60th Anniversary Grand Alumni Homecoming. It has two pages: `index.html` (home) and `rsvp.html` (RSVP form). Design decisions are in `design-system.md`; the project guide is in `claude.md`.

## RSVP setup

RSVPs go to a Google Sheet. The form on `rsvp.html` posts to a small Google Apps Script (`apps-script/Code.gs`) that is deployed as a web app and appends one row per response.

You need a Google account and about 10 minutes.

### 1. Create the Sheet

- [ ] Go to [sheets.new](https://sheets.new) to create a blank Google Sheet.
- [ ] Name it, e.g. **MNHS Homecoming RSVPs**.
- [ ] Rename the tab at the bottom from `Sheet1` to **`RSVPs`** (double-click it). The name must match `SHEET_NAME` in `Code.gs`.
- [ ] Type this header row in row 1, one heading per cell, from A1 to E1:

  | A | B | C | D | E |
  |---|---|---|---|---|
  | Timestamp | Full Name | Attending | Companions | Total Headcount |

- [ ] Optional: **View → Freeze → 1 row**, so the headers stay visible as rows are added.
- [ ] Optional: the total number of guests is `=SUM(E2:E)`. Put it in a cell outside columns A–E, such as G1.

### 2. Add the Apps Script

- [ ] In the Sheet, open **Extensions → Apps Script**. A new tab opens with a project attached to this Sheet.
- [ ] Rename the project (top left, "Untitled project"), e.g. **MNHS RSVP**.
- [ ] Delete everything in `Code.gs` in the editor, then paste the full contents of `apps-script/Code.gs` from this repo.
- [ ] Click **Save** (the disk icon, or Ctrl/Cmd + S).

### 3. Authorize and test

- [ ] In the toolbar's function dropdown, pick **`testSubmission`**, then click **Run**.
- [ ] When asked, click **Review permissions** and choose your Google account.
- [ ] If you see "Google hasn't verified this app", click **Advanced → Go to MNHS RSVP (unsafe)**. This warning appears because the script is yours and hasn't been reviewed by Google, which is expected.
- [ ] Click **Allow**. The script only asks for access to the spreadsheet it's attached to.
- [ ] Check the execution log for `{"ok":true}`. A row named **TEST: delete me** should appear in the Sheet. **Delete that row.**

### 4. Deploy as a web app

- [ ] Click **Deploy → New deployment**.
- [ ] Click the gear icon next to "Select type" and choose **Web app**.
- [ ] Description: e.g. `RSVP v1`.
- [ ] **Execute as: Me** (your account). This is what lets the script write to your Sheet.
- [ ] **Who has access: Anyone**. Choose plain "Anyone", not "Anyone with Google account". Guests aren't signed in to Google.
- [ ] Click **Deploy**. If asked to authorize again, repeat step 3's permission prompts.
- [ ] Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/…/exec`.
- [ ] Paste the URL into a browser tab. You should see `{"ok":true,"service":"MNHS RSVP"}`.

### 5. Connect the website

- [ ] Open `js/rsvp.js` and paste the URL into the constant near the top:

  ```js
  const RSVP_ENDPOINT = 'https://script.google.com/macros/s/…/exec';
  ```

- [ ] Publish the site, open `rsvp.html`, and send a test RSVP. Check that the row appears in the Sheet, then delete it.

> [!WARNING]
> **Changed `Code.gs` later? Update the existing deployment. Don't create a new one.**
> Every **New deployment** gets a **new URL**, and the website would keep posting to the old one.
> To publish changes and keep the same URL:
> **Deploy → Manage deployments → select the deployment → Edit (pencil icon) → Version: New version → Deploy.**
> Saving the script alone doesn't update the live web app. You must deploy a new version.

### Good to know

- **The deadline is set in two places:** `RSVP_DEADLINE` in `js/rsvp.js` (hides the form) and `RSVP_DEADLINE` in `apps-script/Code.gs` (rejects late submissions). Change both together. The script's deadline is the one that counts. If it answers `closed`, the website shows the closed message.
- **Spam:** the hidden "website" field is a honeypot. If a bot fills it in, the script answers `{ ok: true }` and writes nothing.
- **Errors:** failed runs are listed in the Apps Script editor under **Executions** (left sidebar).
- **Timestamps** are written in Philippine time (`Asia/Manila`).
