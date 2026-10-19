# Homepage — setup and administrator guide

The homepage (`web/src/pages/index.astro`) is built entirely from Strapi.
Routine changes — new photos, highlights, notices, events, section order —
never need a code change.

## How it fits together

| Homepage part | Edited in Strapi | Notes |
|---|---|---|
| Hero (video, photo, headline, buttons) | **Home – Page** → hero fields | Video plays on wide screens after the page loads; phones and “reduce motion” visitors see the photo. |
| “Latest” ticker (bottom of the hero; top on phones) | **Home – Page** → *Show ticker* | Scrolls the newest current notices; pauses on hover. Untick to hide. |
| Everything below the hero | **Home – Page** → **Sections** | Add, drag to reorder, untick *Is visible* to hide. |
| Latest Highlights | **News & Notices – News** | One News story = article + photo gallery + homepage highlight. |
| News & Notices | **Notices**, **Announcements**, **Recruitment (Vacancies)** | Same feed as the Announcements page. |
| Upcoming Events | **News & Notices – Events** | Past events drop off automatically. |
| Programmes, Research, Campus, Resources | Picked inside each section | Programmes, Research Centres, Campus Facilities, Downloads & Forms. |
| Header menu, footer | **Global – Header & Navigation**, **Global – Footer** | Unchanged. |

Code: `web/src/lib/content/homepage.ts` (data and publication rules),
`web/src/components/home/*` (one component per section),
`web/src/styles/home.css`. CMS: `cms/src/components/home/*`,
`cms/src/seed-home.ts` (starting content + admin help),
`cms/src/site-rebuild.ts` and `cms/config/cron-tasks.ts` (automatic rebuilds).

## Publication rules

- Only **published** content is shown (the website reads Strapi with a read-only token at build time; the public API exposes no content).
- **Highlights:** newest first by story date. Stories picked in the section's *Stories* list come first, then stories ticked **Pinned**, then the rest. Hidden when *Show on homepage* is unticked, *Archived* is ticked, *Expires at* has passed, or *Publish at* is still in the future.
- **Notices:** pinned (*Is featured*) first. A notice leaves the homepage at *Expires at*; a vacancy after its application deadline (end of that day, Bhutan time) or when set to *closed*. Both stay in the archives.
- **Events:** sorted by start time (Bhutan time). An event leaves the list when it ends; it stays on the Events page and its event page.
- **Statistics:** only figures ticked **Verified** appear; the section hides itself if none are.
- A section with nothing to show disappears, unless it has an *Empty text*.

## When changes appear

The website is static (fast and secure), so changes appear after a rebuild:

1. **On publish** — set `SITE_REBUILD_WEBHOOK_URL` and Strapi calls it 60 seconds after the last change (one build for a burst of edits). Typical time to live: about 1 minute plus the build (around 1–2 minutes).
2. **Nightly** — 00:05 Bhutan time, so dates roll over (expired notices, past events) even when nobody edits.
3. **Between builds** — the page itself hides any highlight, notice or event whose end time has passed, and re-checks “Closes soon” deadlines in the visitor's browser.

Without the webhook, changes appear at the next manual `npm run build`.

## Environment variables

`cms/.env` (Strapi):

| Variable | Purpose |
|---|---|
| `SITE_REBUILD_WEBHOOK_URL` | Build hook of the host or CI job that runs `npm run build` in `web/`. Empty = no automatic rebuilds. |
| `REBUILD_DEBOUNCE_SECONDS` | Wait after the last change before rebuilding (default 60). |
| `CRON_ENABLED` | Nightly rebuild (default `true`). |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` | Existing Strapi secrets. |

`web/.env` (website build):

| Variable | Purpose |
|---|---|
| `STRAPI_URL` | Strapi address used at build time. |
| `STRAPI_API_TOKEN` | **Read-only** API token (Settings → API Tokens). Used only during the build; never sent to browsers. |
| `PUBLIC_STRAPI_URL` | Public Strapi address for the enquiry, contact and alumni forms. |

Never put a full-access or write token in `web/.env`, and never prefix a secret with `PUBLIC_`.

## Setup

1. Start Strapi (`cms/`: `npm run develop`). On first start it adds the homepage sections, help text and editor-role permissions automatically (`seed-home.ts`, `admin-roles.ts`).
2. In the hosting provider or CI, create a build hook that runs `npm ci && npm run build` in `web/` and deploys `web/dist`; put its URL in `SITE_REBUILD_WEBHOOK_URL`.
3. Restart Strapi. The log shows `[site-rebuild] enabled`.

## Administrator guide

**Add photos from a college event (new highlight)**
1. Content Manager → **News & Notices – News** → *Create new entry*.
2. Title, story date, category (e.g. *Celebrations*), summary and text.
3. **Images:** upload the photos — the first is the cover. **Gallery:** extra photos. In the Media Library, give every photo *Alternative text* (and a caption / credit if wanted).
4. Optional: tick **Featured**; tick **Pinned** to keep it at the front.
5. **Save**, then **Publish**. It appears on the homepage after the next rebuild.

**Add an image to a homepage section** (e.g. Student Life & Campus)
Home – Page → Sections → *Student Life & Campus* → **Cards** → *Add an entry*: image, alt text, title, caption, link. Drag the card to order it. **Save** → **Publish**.

**Keep an older story at the front:** open the story → tick **Pinned** → Save → Publish. Untick to release it.

**Publish a notice or vacancy:** *Notices* (set **Expires at**; tick *Is featured* to pin) or *Recruitment (Vacancies)* (set the **application deadline**). It leaves the homepage automatically after that date and stays in the archive.

**Publish an event:** *Events* → title, start and end (Bhutan time), venue, category, poster image, registration link. After the event, link its photo story in **Photo story**.

**Reorder, hide or restyle sections:** Home – Page → Sections → drag sections; untick *Is visible* to hide; change *Background*; set two neighbouring sections to *Width: half* to place them side by side. **Publish** Home – Page.

**Remove something from the homepage:** open it and click **Unpublish** (or untick *Show on homepage* for a News story).

**Roles:** *Website Manager* (everything), *Home Editor* / *News & Notices Editor* etc. (their area, can publish), *Content Author (Draft Only)* (drafts only — a publisher reviews and publishes), *Viewer* (read-only). The Community edition has no built-in review stages, so the draft → publisher step is the approval process.

## Verification checklist (administrator scenarios)

Run against the development servers on 15 Oct 2026 with test records, which were then deleted. The edits were made through Strapi's Document Service (what the admin panel uses) and the homepage was reloaded.

| | Scenario | Result |
|---|---|---|
| A | New story with 3 photos, featured, published | Appeared in Latest Highlights with its cover and “3 photos”. ✅ |
| B | Picture card (image, alt text, caption) added to Student Life & Campus | Shown first in that section with its alt text and caption. ✅ |
| C | Older story pinned | Stayed first, ahead of newer stories, marked “Pinned”. ✅ |
| D | Vacancy closing in 3 days / vacancy past its deadline | Open one shown with “Closes soon · Deadline”; past one not on the homepage but still on the Recruitment page. ✅ |
| E | Event in 2 days / event that ended yesterday | Upcoming shown; past one not on the homepage but still on the Events page. ✅ |
| F | College Introduction moved to the top | Homepage order changed accordingly. ✅ |
| G | Highlight unpublished | Gone from the homepage. ✅ |
| — | Rebuild webhook (test listener, 2 s debounce) | Several edits in a row → one webhook call; unpublish → one call. ✅ |

To re-test after a deployment: publish a test story, wait for the build to finish, check the homepage, then unpublish it and check again.
