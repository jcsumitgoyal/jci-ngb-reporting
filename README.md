# JCI India NGB — Zone Reporting App

A single-file web application for JCI India's National Growth & Development reporting hierarchy.

**How the hierarchy works in the app:**

- **ZP (Zone President)** — signs in and submits a monthly zone report (programs, meetings, new members, total membership, highlights, remarks). Re-submitting for the same month updates the earlier report.
- **NVP (National Vice President)** — signs in and sees the **consolidated report of only their assigned zones**: totals, a zone-by-zone submission status matrix, every zone's full report, CSV download, and print/PDF.
- **NEC** — signs in as `nec` and sees the national consolidated view across all six areas.

**Zone → NVP Area mapping (built in):**

| Area | Zones |
|------|-------|
| A | 3, 13, 14, 20, 29 |
| B | 1, 8, 9, 11, 19 |
| C | 10, 15, 16, 23, 28 |
| D | 2, 4, 5, 18, 25 |
| E | 12, 17, 21, 24 |
| F | 6, 22, 26, 27 |

---

## Report formats

The app follows the official JCI India formats:

- **ZP form** = *Zone President Report* (`ZP_REPORTING_FORMAT_FOR_IV_NGB.docx`): report details, Zone Status (Membership & Foundation Contribution with auto-calculated Shortfall and Achieved %), Zone Details (disaffiliation/suspension/revival/JVC, Centurion & Star LOs), Target/Achievement (Membership Annual & 2nd Half, New LO's, Lady LO's, JrJc Wing, JCOM Tables & Members, JAC Members), all 16 Foundation Contribution titles (HGF → JFI, Senator, PPP, Others), Events Participation (ASPAC → NATCON plus LOTS/PA/MIDCON/R2R/STAR/APS/Parliamentarian/ZONCON participants), Any Other Contribution, NVP/NP Visit Details, Major Events (add as many rows as needed), Efforts, and Action Marks. Reports are filed per period (I NGB … V NGB, VI NEC & IV NGB) and can be updated by resubmitting.
- **NVP report** = *National Vice President Report* (`NVP_Report_Format.docx`): the app **auto-consolidates** submitted ZP reports zone-wise into the NVP format — Overall Area Status with zone-wise breakdown and area totals, Target/Achievement per zone, Foundation Contribution per zone with total amount, Other Contributions, Visit Details, Events Participation, Major Events, Efforts, and Action Marks. The NVP fills in only the sections that come from them: Last Year Membership Status and National Events Bids. Use **Print / PDF** to produce the report for submission to `management@jciindia.in`, or **Download CSV** for Excel.
- **NEC** sees the same consolidation for all six areas.

---

## 1. Quick start (try it right now)

Serve the folder locally (e.g. `python3 -m http.server`) and open `index.html`, or just push to GitHub Pages. With no Firebase config, the app runs in **local demo mode** — everything works, but data is saved only in that browser. Use this to test the flow before going live.

## 2. Host on GitHub Pages

1. Create a new GitHub repository (e.g. `jci-ngb-reporting`).
2. Upload `index.html` and this `README.md`.
3. In the repo: **Settings → Pages → Source: Deploy from a branch → main / root → Save**.
4. Your app will be live at `https://<your-username>.github.io/jci-ngb-reporting/`.

## 3. Enable shared multi-user data (Firebase — free)

GitHub Pages only serves files; for all ZPs and NVPs to see the same data you need a small database. Firebase's free tier is more than enough:

1. Go to <https://console.firebase.google.com> → **Add project** (e.g. `jci-ngb`).
2. In the project: **Build → Firestore Database → Create database** (production mode, region `asia-south1` for India).
3. Click the **Web** icon (`</>`) to add a web app, and copy the config object it shows.
4. In `users.js`, paste it into `FIREBASE_CONFIG`:

```js
const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "jci-ngb.firebaseapp.com",
  projectId: "jci-ngb",
};
```

5. In **Firestore → Rules**, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow read, write: if true;
    }
    match /nvp_reports/{reportId} {
      allow read, write: if true;
    }
    match /login_logs/{logId} {
      allow read, write: if true;
    }
    match /config/{docId} {
      allow read, write: if true;
    }
    match /nd_reports/{reportId} {
      allow read, write: if true;
    }
  }
}
```

6. Commit the change — the demo-mode banner disappears and all users now share one live database.

> Note: these open rules are simple and fine for an internal organisational tool, but anyone who discovers the endpoint could technically write to it. If you later want stricter security, the upgrade path is Firebase Authentication + rules that check the signed-in user.

## 3b. Login activity log

Every sign-in attempt (successful or failed) is recorded with the username, name, role, zone/area, timestamp, and device. The NEC can view it: sign in as `nec` and click **Login Activity**, or add `#logins` to the site URL. The log shows the latest 200 attempts and can be exported to CSV. Only NEC can open this view.

## 3c. National Directors' reports

Seven portfolios each have their own official format: Growth & Development, Business, Community Development, Training, Management, PR & Marketing, and Junior Jaycee (National Coordinator).

- Each ND signs in and fills only their own portfolio report (draft or final submit), and can print it as PDF.
- ZPs, NVPs and NEC can **view** every submitted ND report but cannot edit them — a "National Directors' reports" button appears in their toolbar.
- SuperAdmin can open and edit any ND portfolio report.
- These reports are standalone: nothing is consolidated from or into the ZP/NVP reports.

ND logins: `ndgd`, `ndbusiness`, `ndcommunity`, `ndtraining`, `ndmanagement`, `ndpr`, `ndjrjc`.

## 4. Drafts, auto-save, and how saving works

- **Save as draft** — keeps the ZP's work (even partially filled) so they can continue later. Drafts are **not** shown to the NVP/NEC; the zone appears amber ("Draft in progress") in the submission matrix.
- **Submit final report** — validates the form and makes the report count in the Area/National consolidation (zone turns green).
- **Auto-save** — every change is also saved automatically on the ZP's device, so an accidental refresh or a lost connection never loses work. If an online save fails, the app keeps the report safely on the device and says so.

**Important — if "data is not saving" between users:** that means Firebase has not been configured yet (step 3 above). Without it the app runs in local demo mode where each browser keeps its own data, so a ZP's submission cannot reach the NVP. Completing the free Firebase setup in step 3 fixes this — it takes about 10 minutes.

## 4b. Usernames and passwords

Every ZP and NVP has a separate login. Defaults:

| Role | Username | Default password |
|------|----------|------------------|
| Zone President | `zp1` … `zp29` (their zone number) | `Zp<zone>@2026` — e.g. zone 14 → `Zp14@2026` |
| NVP | `nvpa`, `nvpb`, `nvpc`, `nvpd`, `nvpe`, `nvpf` | `Nvp<Area>@2026` — e.g. Area C → `NvpC@2026` |
| NEC | `nec` | `Nec@2026` |

### Changing a password (do this before going live)

Passwords are stored as SHA-256 hashes in the `USERS` list in `users.js` — plain passwords never appear in the code.

1. Open your live site with `#hash` at the end of the URL (e.g. `.../index.html#hash`).
2. Type the new password — the tool shows its hash.
3. In `users.js`, find that user in the `USERS` array and replace the `"p"` value with the new hash.
4. Commit and push.

### Adding or removing a user

Edit the `USERS` array — each entry is `{u, p, role, zone, area}`. To move a zone to a different NVP, edit the `AREAS` object at the top of the script.

## 4c. Version numbering

`users.js` holds `APP_VERSION`, `APP_UPDATED` and an `APP_CHANGES` list. Bump the version every time you publish a change:

```js
const APP_VERSION = '1.1';
const APP_UPDATED = '2026-09-02';
const APP_CHANGES = [
  ['1.1','2026-09-02','What changed in this release.'],
  ['1.0','2026-08-25','First release.'],
];
```

The version shows on the login screen, in every page footer, and in the SuperAdmin console with the full changelog. It is also stored with each login record and each saved report, so you can tell which build produced any given entry. If someone reports odd behaviour, ask which version their footer shows — an old number means their browser is serving a cached copy and a hard refresh (Ctrl+Shift+R) will fix it.

## 5. Files

```
index.html   — page shell and styles
users.js     — Firebase config, zone/area mapping, usernames & password hashes (the only file you normally edit)
app.js       — application logic (ZP report form, NVP/NEC consolidation, CSV, print)
README.md    — this guide
```
