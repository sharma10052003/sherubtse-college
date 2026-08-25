# Decision Log

Per the Project Plan (section 02, "Standing rules"): every architectural decision gets a
short entry — context, options, choice, consequences — started week 1, in the repository,
not in Drive or a wiki. This file is that log for the CMS rebuild described in the
Website Build Brief, Visual Style Guide, and Project Plan.

Entries are chronological. Each is `Decided` or `Open` (blocking milestone M1 — content
model sign-off — until resolved).

---

## 001 — Full rewrite to static-generated frontend, Strapi never public
**Status:** Decided

**Context:** The existing site in this repository (`about/`, `departments/`, `programmes/`,
`academics/` etc.) is PHP that queries Strapi live, on every request, via
`includes/strapi-client.php`. The Build Brief specifies a different architecture:
a static site generator (confirmed as **Astro** by the Project Plan, Track B) pulling
from the Strapi API at build time, with Strapi kept off the public internet entirely.

**Options considered:** (a) full rewrite to match the brief exactly, (b) keep the live-PHP
architecture and only adopt the brief's content model within it, (c) hybrid.

**Choice:** (a) — full rewrite, confirmed explicitly by the project owner.

**Consequences:** The PHP frontend work already shipped this project (Faculty Profile
System, Department Hero, Academics redesign — commits `13a25ef`..`1330085`) will be
superseded by Astro templates once Track B starts. The underlying Strapi content types
largely carry forward conceptually (Department → Unit, Faculty Profile → Person,
Programme → Programme) but will be rebuilt against the 13+3 type model in Build Brief
section 02, not incrementally migrated from the current schema.

---

## 002 — Content audit built from a live crawl, not the local rebuild
**Status:** Decided

**Context:** Build Brief step 00.1 calls for an audit of "the current site" — but this
repository's local PHP+Strapi rebuild is not what that means; the brief's specific
findings (duplicate homepages, ~60+ recruitment pages, injected spam) describe the real,
live production site.

**Choice:** Audited `https://www.sherubtse.edu.bt` directly via its WordPress sitemaps
(215 rows: 192 pages + 10 posts + subdomains + third-party links), not the local project.

**Consequences:** Surfaced a live security compromise (gambling spam embedded in the
homepage body content, plus a 2,000-URL spam sitemap at `/sitemap.xml` dated 2024-01-19)
requiring separate, immediate action from whoever owns hosting — independent of this
project's timeline. See `Sherubtse-Content-Audit-v4.xlsx`, Content Audit tab, rows 1–2.

---

## 003 — Owning unit "Registrar's Office" merged into "HR/Admin"
**Status:** Decided

**Context:** The audit's Owning Unit column initially split admissions/results content
(Registrar's Office) from recruitment content (HR) into two units.

**Choice:** Merged into a single `HR/Admin` unit across all affected audit rows, per
explicit instruction.

**Consequences:** When the `Unit` content type is seeded, admissions, results, and
recruitment content all get one owning-unit record, not two.

---

## 004 — Super Admin role and permissions
**Status:** Decided

**Context:** Build Brief section 04 defines three roles (Super Admin / Publisher /
Contributor). The project owner needs to be confirmed as Super Admin before any Strapi
roles are actually configured.

**Choice:** Project owner is Super Admin with full control over all content and full
rights to create/assign roles and permissions for every other user — this is the
brief's own Super Admin definition verbatim, not an extension of it.

**Consequences:** No other role changes needed in the brief's role table. Carries forward
unchanged into the actual Strapi roles setup in Track A.

---

## 005 — "Feature" added as a 14th collection type
**Status:** Decided (pending IT Section notification)

**Context:** The Photography Brief commissions 3–4 "feature sequences" against "the
website's long-form Feature template" — but the Build Brief's section 02 lists 13
collection types and none of them is Feature. Cross-referencing the two documents
surfaced a genuine model gap that neither document alone would have shown.

**Choice:** Add `Feature` as a 14th collection type: `title`, `slug`, `hero_image` (16:9),
`sequence` (repeatable component, ordered image+caption frames), `related_unit`
(optional), `owning_unit` (required, standard governance field), `last_reviewed`
(required), `expires_at` (optional — Features are explicitly evergreen, unlike every
other type in the model).

**Consequences:** Must be flagged explicitly to IT Section before the model is frozen at
M1, since it's an addition to their own document, not something either brief predicted.
See `Sherubtse-Content-Audit-v4.xlsx`, Photography Brief tab, section D.

---

## 006 — Photo consent fields added to Person
**Status:** Decided

**Context:** The Photography Brief requires written consent from every identifiable
person before publication, plus a standing withdrawal right. The Build Brief's Person
type has `contact_consent` gating email/phone display, but nothing equivalent gating the
portrait photo itself.

**Choice:** Add `photo_consent` (boolean, default false) and `photo_consent_date` (date)
to Person. The photo does not render publicly until `photo_consent` is true.

**Consequences:** Portrait shoot delivery (Photography Brief section 07) and this field
must be wired together before any real portraits go live — a portrait with no recorded
consent should behave the same as a Person record with no photo at all.

---

## 007 — Academic department count confirmed: 3
**Status:** Decided

**Context:** This project's earlier PHP-Strapi work modelled 3 departments (Humanities &
Social Sciences, Mathematical & Data Sciences, Natural Sciences). The live-site audit
found 5 department/faculty pages (Arts & Humanities, Mathematical Sciences, Environmental
& Life Sciences, Physical Sciences, Social Science).

**Choice:** 3 departments, matching the earlier modelling. The live site's 5 pages are a
website inconsistency, not real organisational structure — Environmental & Life Sciences
and Physical Sciences consolidate into Natural Sciences; Arts & Humanities and Social
Science consolidate into Humanities & Social Sciences.

**Consequences:** The `Unit` (kind: academic) content type is seeded with exactly 3
records. The 2 programme pages already flagged as duplicates (section C of the Model
Review) plus this consolidation together determine the final department→programme
mapping. The Photography Brief's portrait shoot can now be scheduled in 3 department
blocks, not 5 — this was the second dependent on this decision, now also resolved.

---

## 008 — International Student section modelling
**Status:** Decided — confirmed by project owner, see decision 024

**Context:** The live site's International Student section (6 sub-pages: Academic
Programme, Eligibility, Fees, Faculty Expertise, Library/Lab, Student Life & Support)
doesn't cleanly fit any of the 13+3 types, and the Build Brief explicitly restricts
`Page` to Vision & Mission / Core Values / History / About — using it here would repeat
the sprawl the brief warns against.

**Recommendation on the table (not yet confirmed):** Build it as a curated landing
template filtered over existing types (Programme / Announcement / Document with an
audience flag) rather than a new type or a Page.

**Needs a decision from:** IT Section / project owner.

---

## 009 — Games & Sports classification
**Status:** Decided — confirmed by project owner, see decision 024

**Context:** Ambiguous from the outside whether `games-sports`/`sports` on the live site
represents a staffed Unit (kind: student_body) with a coordinator, or just an
informational Document about facilities.

**Needs a decision from:** IT Section / project owner.

---

## 010 — Project Plan treated as milestone/quality-bar guidance, not literal staffing
**Status:** Decided

**Context:** The Project Plan assumes four named people across Schema/Infrastructure/
Frontend/Content owner roles, a 24-week calendar, and milestone gates paced around human
availability and department response times. In this actual engagement, the technical work
across all four tracks has so far been executed by a single AI-assisted operator working
with one project owner, not a four-person team.

**Choice:** Use the plan's milestones (M1 model freeze, M2 three units live, etc.), risk
register, and launch criteria as real checkpoints and a real quality bar — without waiting
on a 24-week calendar or four human role-owners to reach them.

**Consequences:** Milestone *content* (what M1 requires to pass) still applies in full;
milestone *timing* does not. Work proceeds as fast as each checkpoint's actual
prerequisites allow.

---

## 011 — Games & Sports classified as a Unit (kind: student_body)
**Status:** Decided — confirmed by project owner (decision 024), no longer reversible-by-default

**Context:** Item 009 above. Ambiguous from the outside whether this is a staffed body or
an informational page.

**Choice:** Classify as `Unit (kind: student_body)`, consistent with Student Association
and the ~22 audited Club pages, which sit in the same part of the live site and are
modelled as Units/Clubs rather than static pages.

**Consequences:** If IT Section confirms it's actually just a facilities blurb with no
coordinator/structure, reclassify to `Document` — a one-field change, not a schema
redesign.

---

## 012 — International Student section built as a filtered view, not a new type
**Status:** Decided — confirmed by project owner (decision 024), no longer reversible-by-default

**Context:** Item 008 above.

**Choice:** No new content type. Add an `audience` value / `featured_for_international`
flag to Programme, Announcement, and Document, and build the International Student
landing as a template that queries existing types filtered by that flag — per the
recommendation already logged in the Model Review tab, now adopted as the working
default.

**Consequences:** Avoids duplicating Programme/Announcement/Document content into a
bespoke Page, consistent with the brief's "every fact is stored once" principle. If IT
Section wants dedicated International Student authoring (not just filtered views of
existing content), this gets revisited as a real new type.

---

## 013 — Track A schema build: naming collisions resolved during implementation
**Status:** Decided

**Context:** Building the 14 collection types + 3 single types (per the approved Track A
plan) surfaced two real naming collisions on inspection of the existing schema, neither
anticipated at planning time.

**Choice:**
- `announcement` already existed (a scrolling ticker/banner type, unrelated shape) — the
  brief's Announcement concept was built as **`notice`** instead. See
  `cms/docs/CONTENT-MODEL.md`.
- Strapi requires a content type's singular and plural names to differ, even from each
  other within the same type — `news`/`news` (the natural English non-plural) collided
  with itself. Resolved as singular `news`, plural route `news-entries`.

**Consequences:** Anyone building the Astro frontend later should read
`cms/docs/CONTENT-MODEL.md`'s naming-resolution table first — the REST paths don't
literally match the brief's prose in these two cases.

---

## 014 — Multi-select fields implemented as `json` arrays
**Status:** Decided

**Context:** The brief specs "multi-select" on Notice.audience and repeatable plain-text
lists on SiteSettings (phones, official_emails). Strapi's `enumeration` field type is
single-select only — there's no native multi-select enum.

**Choice:** Implemented as `type: "json"` fields (each stores an array of strings)
rather than inventing a lookup collection type for what's really a small fixed
vocabulary.

**Consequences:** No validation that array values match the intended vocabulary — that's
enforced by the future admin UI/editor discipline, not the schema. Acceptable for now
given the vocab is small and brief-specified; revisit if it grows or needs its own
management UI.

---

## 015 — Programme's new governance fields left optional, not required
**Status:** Decided

**Context:** Every brand-new type gets `owning_unit`/`last_reviewed` as `required: true`
per the governance-fields rule. `programme` isn't new — it's extended in place, with 8
real seeded records that predate these fields.

**Choice:** Left `owning_unit` and `last_reviewed` optional on `programme` specifically
(the 13 new types keep them required).

**Consequences:** Editors can save an existing programme without immediately being
forced to fill in governance fields on an unrelated edit. Trade-off: nothing stops a
programme from staying ungoverned indefinitely — worth tightening to required once all 8
existing records have real values, likely during the Track C content-load phase.

---

## 016 — Feature schema reconciled against Stack/IA/Wireframes doc's fuller spec
**Status:** Decided

**Context:** Track A built `feature` from the Photography Brief's description alone
(hero image + an ordered sequence of 3-6 supporting frames). The Stack, Structure &
Wireframes document has a full dedicated "Feature content type" subsection (§07) that's
more detailed and, being the later and more specific source on this exact type, treated
as authoritative where the two differ.

**Choice:** Added `standfirst` (required), `author` (relation → Person) + `author_name`
(free text, for student writers not in the Person directory — the brief allows either;
enforcing "at least one" is left as an editorial rule, not a schema constraint, to avoid
a lifecycle hook for a soft business rule), `body` (richtext — supports inline images
and pull quotes natively, replacing the discrete frame-sequence approach), `theme` enum,
`related_people` + `related_units` (both many-to-many, replacing the earlier singular
`related_unit`). Removed the `sequence` field and deleted the now-unused
`feature.feature-frame` component (no data existed yet, so a clean replacement, not a
migration). `reading_time` is explicitly **not** a Strapi field — the doc calls it
"calculated at build," so it belongs in the Astro build step (word count on `body`), not
stored/duplicated in the CMS.

**Consequences:** No data loss (zero Feature records existed). `cms/docs/CONTENT-MODEL.md`
updated to match.

---

## 017 — Visual Style Guide confirmed as the token/CSS-methodology source for Track B only
**Status:** Decided

**Context:** The actual Visual Style Guide (v1.4) was shared, resolving the caveat noted
when Track B's plan was written. It confirms the design tokens already assumed (navy
`#0D1B4B`, gold `#F0B429`, Source Serif 4 + Public Sans, `s1`-`s9` spacing) and adds
detail not previously available: the full colour set including text-safe `gold-ink
#8A6410` (the *only* gold permitted as text — gold is a surface colour, never body
text), a hard grid spec (1140px max width, 12/6/4 columns, breakpoints at 760px/1024px
only), `0px` border-radius everywhere, exact photography ratios (16:9 hero, 3:2
card/article, 4:5 portrait), a CI-enforced performance budget (500KB page total, 0KB JS
by default), and — most consequential for how the CSS gets written — a checkable
mobile-first rule: **base CSS is the mobile layout; every media query uses `min-width`,
never `max-width`.**

Asked explicitly which site this applies to: the answer is the **new Astro build (Track
B) only** — the current live PHP site is not being restyled and stays untouched until
Astro replaces it, consistent with decision 001.

**Note on template count:** the Style Guide's own §07 sketches only 5 templates
(Homepage, Department, Listing, Article, Profile) — simpler than the Stack doc's 9 (+
Feature = 10). Not a conflict: the Stack doc's `Unit` type is the Style Guide's
"Department, identical for all departments" generalised to also cover administrative
units, research centres and clubs, and the Stack doc's Section landing/Content
page/Programme/Calendar/Feature templates are a later, fuller elaboration the Style
Guide doesn't contradict. The Stack doc's 10-template set remains what's being built.

**Consequences:** `web/src/styles/tokens.css` (Track B) is authored directly from this
guide rather than from the four planning docs' repeated `:root` block — same values,
now with the fuller colour set and the mobile-first authoring rule applied throughout
every stylesheet in `web/`.

---

## 018 — Track B initial build complete and verified
**Status:** Decided

**Context:** All 10 templates (Homepage, Section landing, Content page, Listing, Unit,
Programme, Profile, Article, Calendar, Feature) now have working Astro routes against
the Track A Strapi schema, per the approved Track B plan.

**Verification results:**
- `npm run build`: clean, 26 static pages generated, Pagefind indexed all 26 (277 words).
- Page weight: ~8KB HTML + 12KB CSS per page, fonts 96KB total, **0KB client JS bundle**
  (only tiny inline scripts for the mobile menu toggle, calendar filter chips, and
  listing "Load more" — all explicitly budget-exempt interactions per Style Guide §09).
  Comfortably under the 350KB target, let alone the 500KB failure threshold.
- Image pipeline confirmed: the 1.6MB interim logo PNG (`web/src/assets/`, not
  `public/` — only `src/`-imported images go through Astro's Sharp pipeline) builds
  down to a 1KB WebP at display size.
- No `max-width` media queries anywhere in the shipped CSS — the mobile-first rule
  holds, checked mechanically rather than by eye.
- No "Lorem ipsum" anywhere in the built output.
- Bottom tab bar / desktop nav toggle confirmed correct at both 375px and 1280px.
- The existing PHP site confirmed unaffected (still 200s on `/departments/`,
  `/programmes/`, `/academics/calendar`) — `web/` is fully additive.

**Left for a follow-up pass, not silently dropped:**
- `navigation` and `site-settings` single types are still empty in Strapi — the site
  currently runs on `getNavigation()`'s hardcoded fallback (matches Stack doc §03
  exactly) rather than real CMS data. `cms/scripts/seed-navigation.js` is written and
  ready; running it needs the same temporary write-permission elevation on the API
  token used earlier for programme seeding (see decision log context around the
  Academics rebuild) — not done yet because it wasn't a hard blocker for verifying the
  templates.
- `notice`/`event`/`unit`/`person`/etc. have zero real records — every dynamic route's
  `getStaticPaths()` correctly returns zero pages for these until Track C content
  collection populates them; this is the expected, resilient behaviour, not a bug.
- News, Recruitment, Tenders, Downloads listings (linked from the News & Notices section
  landing) aren't built yet — only Announcements, Events and Archive are, since those
  were the ones with the clearest existing content modules and the homepage/bottom-tab
  links pointing at them. Same ListingTemplate/ArticleTemplate pattern extends to the
  rest in a follow-up pass.

---

## 019 — Strapi's SQLite database and uploaded media committed to git
**Status:** Decided

**Context:** All of today's work (Track A schema, Track B site) existed only on this one
machine — nothing was committed. Explicit request: make it available on another device
under the same account. Committing code/schema alone would leave the actual content
(departments, programmes, uploaded images) behind, since that data lives in
`cms/.tmp/data.db` (Strapi's dev SQLite file) and `cms/public/uploads/`, both previously
gitignored.

**Choice:** Un-ignore and track `cms/.tmp/data.db` (4.1MB) and `cms/public/uploads/*`
(48MB) specifically — not the rest of `.tmp` (build locks/cache, still ignored).

**Consequences:** This is a deliberate deviation from normal practice (a SQLite dev
database is not usually version-controlled, and the Stack doc §01 already specifies
PostgreSQL for production — this file was never meant to be the permanent home for real
content). It's a pragmatic interim measure to get the current data onto another device
now, not a substitute for the real backup strategy Track D still owes (daily, off-site,
tested quarterly). Binary diffs on this file will bloat repository history over time —
worth moving to a proper Postgres-based workflow with real backups before this becomes
a habit, not a permanent pattern.

---

## 020 — `main` fast-forwarded to include Track A/Track B; `feature/faculty-profile-system` and `chore/strapi-launch-config` retired

**Status:** Decided

**Context:** A separate local checkout of this repository (used for a working-plan review
against the Website Requirements and Content Specification) had a corrupted `.git` object
store: `cms/src/api`'s 14 collection types, 8 components, and 26 of `web/`'s page
routes/templates/data-fetchers were tracked by that checkout's index but the underlying
blobs were missing — not recoverable there even from a fresh clone of `origin/main`,
because `main` had never included commit `56a6041` ("Add Strapi content model rebuild
(Track A) and Astro frontend (Track B)") in the first place. That checkout spent
significant effort reconstructing the schema from `cms/docs/CONTENT-MODEL.md` and
rebuilding the Astro layer from scratch, on the mistaken premise that the work was
genuinely lost.

It wasn't. A fresh clone of `origin/feature/faculty-profile-system` (rather than
`origin/main`) showed commit `56a6041` fully intact on GitHub — the real, original Track
A/Track B implementation that decision 018 verified, not a reconstruction. The problem
was entirely local to one machine's checkout; nothing was ever actually lost from the
remote.

**Choice:** Fast-forwarded `main` directly to `56a6041` (`git push origin
origin/feature/faculty-profile-system:refs/heads/main`) rather than merging the
reconstruction — `main` was a strict ancestor of `feature/faculty-profile-system`, so this
was a clean fast-forward with no conflicts and no data loss. Deleted the now-fully-merged
`feature/faculty-profile-system` branch on the remote, and the already-merged
`chore/strapi-launch-config` branch (both remote and the stale local copy). `main` is now
the only branch, and it holds the authentic Track A/Track B work.

**Consequences:** Anyone else with a local checkout showing `cms/src/api` or `web/src`
mostly empty should re-clone or hard-reset to `origin/main` rather than reconstructing —
check `git fetch && git log origin/main` first. The specification's own §1.5 ("PHP front
end confirmed") remains a separate, genuine documentation error independent of this
incident — Astro is still the confirmed stack per decisions 001/017/018, and that
specification text still needs correcting to match, which this decision does not do.

---

## 021 — Phase 1 (colour system) audited against the real code: clean except the crest

**Status:** Decided

**Context:** Working-plan Phase 1 calls for a single approved colour per job, no
near-duplicates, and the crest supplied as SVG. Audited the actual authentic code (post
decision 020, not a reconstruction) rather than re-trusting the plan document's earlier
draft findings.

**Findings:**
- Navy: only `#0D1B4B` exists anywhere in the repo — the near-duplicate `#1D204D` the
  plan flagged from measuring the physical crest is not present in any file.
- Gold-as-text: zero violations — `var(--gold)` is never used as a text `color:`
  anywhere in `web/src/styles/`, only as border/surface.
- Maroon/navy separation: `assets/css/variables.css` (old PHP site, `--stc-maroon` etc.)
  and `web/src/styles/tokens.css` (Astro, `--navy` etc.) share zero hex values in either
  direction.
- Crest colour claim verified directly: pixel-sampled `assets/images/sherubtse-logo.png`
  (1024×1024) with `sharp` — the shield's dominant colour is `#FFF600`-ish, matching the
  plan's `#FCEA00` "too bright/green for the palette, must never sit on a gold
  background" finding.
- Crest SVG: still missing. Only a 1.6MB PNG and a 31KB JPG exist in the repo — no
  vector source anywhere.

**Choice:** Everything in Phase 1 is already correct in the codebase except the crest
vector file, which the project owner will source directly (official artwork from IT
Section/marketing) rather than have it auto-traced from the raster photo — tracing an
official identity mark risks introducing real errors into something meant to be
authoritative.

**Consequences:** Phase 1 is effectively done pending that one asset. Once the SVG
arrives, replace `assets/images/sherubtse-logo.png`/`.jpg` and `web/src/assets/
sherubtse-logo.png`, and re-run the Astro build's image pipeline (decision 018 confirmed
it compresses a `src/`-imported PNG logo to ~1KB WebP — an SVG source should do at least
as well). Next up per the plan is Phase 2, which is blocked on IT Section decisions
(items 1–3 in Section 5 of the working plan), not on anything further from this session.

---

## 022 — Phase 2: the four missing listing pages built; everything else genuinely blocked on inputs this session doesn't have

**Status:** Decided

**Context:** Working-plan Phase 2 (freeze the site structure) has five steps. Attempted
all five against the real, authenticated system rather than assuming.

**2.1/2.2 (IT Section decisions) — blocked, not attempted.** Confirming the International
Student section model, the Games & Sports classification, and the six-section top level
are explicitly the project owner's/IT Section's calls (decisions 008/009 are still open
in this log for exactly that reason). Nothing to build here; these need an actual answer
from a person, not code.

**2.3 (seed navigation/site-settings) — blocked on permissions, verified directly.**
Booted Strapi and tested `web/.env`'s `STRAPI_API_TOKEN` directly: it has read access
(`GET /api/notices` → 200) but not write (`PUT /api/navigation` → 403 Forbidden). This
matches the plan's own diagnosis exactly ("needs a temporary permission change on the
access token"). Elevating it requires logging into the Strapi admin panel, which needs
credentials this session doesn't have. Confirmed as a byproduct: `GET /api/navigation`
returns 404 (not 403) — the single type genuinely has zero records, not a permissions
issue on the read side.

**2.4 (build the four missing listing pages) — done.** `web/src/lib/content/{news,
recruitment,documents}.ts` (Tenders needed no new module — it's Notice filtered by
`category: "tender"`, the same pattern as Admission Notices, confirmed by reading the
real `notice` schema's category enum, which already includes `"tender"`) plus 6 new
page routes: `/news-notices/{news,recruitment}/index.astro` and `[id].astro`,
`/news-notices/tenders/index.astro` (reuses the existing `/news-notices/announcements/
[id]` detail route since it's the same content type), and `/news-notices/downloads/
index.astro` (a document register table — spec's `document-row` shape needs
version/format/size columns, which `ListingTemplate`'s row shape doesn't carry, so this
one is a plain table rather than forced through the shared template). `news-notices/
index.astro` already linked to all four routes without edits needed. Build verified:
`npm run build` succeeded, 30 pages (up from 18 — the 4 new listing pages, plus several
department/programme dynamic pages that now resolve because Strapi has real pre-existing
data for those two types).

**2.5 (redirect map for the 215 audited addresses) — blocked, not attempted.** The
underlying content audit (`Sherubtse-Content-Audit-v4.xlsx`, referenced in decision 002)
isn't in this repository. Searched for it; not present. Cannot build a redirect map
without the actual list of old URLs to map.

**Consequences:** Phase 2 is roughly 20% complete by step count, but the completed step
(2.4) is real and verified. The other four steps are correctly blocked, not skipped —
2.1/2.2 need IT Section answers, 2.3 needs elevated Strapi credentials, 2.5 needs the
audit spreadsheet. None of these should be worked around; they're listed here so the next
session doesn't waste time re-diagnosing the same blockers.

---

## 023 — Phase 2.3 done: navigation and site settings seeded with real data

**Status:** Decided

**Context:** Decision 022 found the "PHP Frontend" API token (the one `web/.env`
actually uses — confirmed by its "last used" timestamp lining up with that session's own
test calls) was read-only, blocking any seeding. The project owner logged into the
Strapi admin panel directly and elevated it.

**Choice:** Verified write access first (`PUT /api/navigation` now returns 200, not
403), then seeded both single types with real data sourced from the live PHP site's own
`includes/config.php` — not invented:
- **Navigation**: the six confirmed top-level sections (About, Academics, Admissions,
  Research, Student Life, News & Notices), matching what's already used consistently
  across the decision log, `CONTENT-MODEL.md`, and the specification.
- **Site Settings**: address, phone and email straight from `$stc_footer['contact']`;
  footer link groups adapted from `$stc_footer['columns']` to the new site's actual
  routes; six subdomain links (Student Portal, Staff Portal, IMS, VLE, Library, Webmail)
  straight from `$stc_quick_links`, the old utility bar's own real list.

**Verification:** Re-fetched both records with `populate` to confirm the component data
saved correctly (not just the top-level fields), then ran `npm run build` — the
`[strapi] navigation failed`/`site-settings failed` fetch warnings that appeared on every
page in every previous build are gone, and the built HTML contains the real menu labels
and contact links (grepped `dist/index.html` directly to confirm, not just trusted the
build log). `getNavigation()`'s hardcoded fallback is no longer what's live.

**Consequences:** Phase 2.3 is done. `homepage` is still an empty single type (expected —
that's Phase 5 content work, not this step). Phase 2 is now blocked only on 2.1/2.2 (IT
Section answers) and 2.5 (the missing audit spreadsheet) — both still require input this
session doesn't have.

---

## 024 — Phase 2.1/2.2 closed: IT Section decisions confirmed by project owner

**Status:** Decided

**Context:** Decisions 008/009 were open, and 011/012 had only ever been "decided by
default — reversible if IT Section objects." The project owner gave direct answers.

**Choice:**
1. International Student section stays a filtered view over existing content (Programme/
   Notice/Document with an audience flag), not a new content type — confirms decision 012
   as final, not a default.
2. Games & Sports stays classified as `Unit (kind: student_body)`, consistent with
   Student Association and the audited Club pages — confirms decision 011 as final, not a
   default.
3. The six top-level sections (About, Academics, Admissions, Research, Student Life, News
   & Notices) are confirmed for now, with an explicit expectation that more can be added
   later — both in the Strapi admin and on the live site — without a rebuild.

**Verification of point 3, not just accepted at face value:** Checked whether the
frontend can actually do this today. `web/src/components/Header.astro` (both the desktop
`primary-nav` and the mobile panel) renders `menu.map(...)` directly from
`getNavigation()` — there is no hardcoded count of six anywhere in the component. Adding
a 7th `nav-item` in the Strapi admin's Navigation single type and rebuilding the site is
already sufficient; no code change is needed to support more top-level sections later.
This also matches `cms/docs/CONTENT-MODEL.md`'s own note that "max-6-top-level... is
editorial policy, not a schema constraint."

**Consequences:** Decisions 008/009 are closed; 011/012 are no longer reversible-by-
default, they're final. Phase 2 is now blocked only on 2.5 (the missing content-audit
spreadsheet). Phase 3 (navigation bar rebuild) is unblocked — it was gated on the site
structure being settled, which it now is.

---

## 025 — Phase 2.5 done: content audit rebuilt from a live crawl, not the missing spreadsheet

**Status:** Decided

**Context:** `Sherubtse-Content-Audit-v4.xlsx` (referenced throughout this log since
decision 002) was never found in this repository or the project owner's Downloads
folder. Rather than stay blocked indefinitely, rebuilt the audit from scratch by
crawling the live site directly — the same method decision 002 used originally.

**Choice — used the real sitemap, not the spam one.** `https://www.sherubtse.edu.bt/
sitemap.xml` is entirely the gambling-spam injection decision 002/006.1 already
flagged (verified again here: 1,000+ URLs, all dated 2024-01-19T16:19:45+08:00, all
male-enhancement product spam). The real sitemap is named in `robots.txt`'s own
`Sitemap:` line: `/wp-sitemap.xml`, a WordPress sitemap index pointing to pages, posts,
and category sub-sitemaps.

**A data-quality issue surfaced and was caught, not shipped:** the `WebFetch` tool's
first pass (which summarizes large pages through a small model) reported 254 page URLs.
Fetching the same sitemap's raw XML directly with `curl` and counting `<loc>` tags found
the true number is **192** — matching decision 002's original count exactly. The
inflated first pass was silently fabricating ~62 URLs that don't exist. Rebuilt the
classification against the verified raw-XML list (192 pages + 10 posts + 3 category
archives = 205 real URLs) and cross-checked programmatically: zero real URLs
unclassified, zero classified URLs that don't actually exist. This is the same
discipline as decision 020/021 — verify against the primary source, don't trust a
summarized intermediate.

**Choice — classification logic:** each of the 205 URLs got Move (maps 1:1 to a new
URL) / Merge (folds into another page or record) / Retire (301s to the nearest sensible
parent — never straight to the homepage, per the plan's own rule), based on matching
against the confirmed content model and the six confirmed top-level sections. Notably,
the live site's `/international-student/` section plus its 5 real sub-pages
(`/academic-programme/`, `/eligibility-application-process/`, `/faculty-expertise-
research-opportunities/`, `/library-lab-facilities/`, `/student-life-support/`) match
decision 008's originally-described 6 sub-pages exactly, confirming that description was
accurate. Department/programme duplicates found on the live site (e.g. two data-science
programme pages, two chemistry pages, `/fina/` + `/fina-2/`) are marked Merge, matching
decision 002's original "duplicate pages" finding.

**Deliverable:** `docs/Sherubtse-Content-Audit-v5.xlsx` — a Content Audit sheet (205
rows: old URL, category, action, target, notes) and a Summary sheet (counts by action
and category, plus 5 items flagged as genuinely needing a human decision rather than
being auto-classifiable — a numeric-slug page with no descriptive content, duplicate
research-centre pages, and two Units with no frontend route built yet). Verified by
reading the written file back and checking row counts and totals match, not just trusting
the write succeeded.

**Consequences:** Phase 2 is now fully done. Section 5 of the working plan should get a
6th superseded item removed (the crest question and this one are the only two that
originally required IT Section input; both are now resolved this session). Building the
actual redirect rules from this spreadsheet is Phase 6.4 work ("the redirect list from
2.5"), not done here — this decision closes the *audit*, not the redirect implementation.

---

## 026 — Phase 3 done: navigation bar rebuilt, verified interactively, not just read

**Status:** Decided

**Context:** Working-plan Phase 3 named five concrete defects in the navigation bar:
the main menu's breakpoint stranding tablet users on a hamburger, emoji bottom-tab icons
that can't take the highlight colour, a mobile panel with no keyboard support, a
hardcoded navigation fallback that would hide a real failure, and a requirement to check
all of this at four widths.

**Choice:**
- **3.1** — `web/src/styles/layout.css`: moved `.primary-nav`/`.menu-toggle`/
  `.mobile-menu`'s breakpoint from `min-width: 1024px` to `760px`, matching where
  `.bottom-tabs` already disappears — no dead zone between the two. Gap tightened to
  `var(--s4)` at 760px (six items need to fit in less width there), widening back to
  `var(--s6)` at 1024px+ for breathing room, added as a third, narrower media query layer
  rather than replacing the base rule — mobile-first, additive, matches the project's own
  standing rule.
- **3.2** — `BottomTabs.astro`: replaced the four emoji with inline SVG
  (`stroke="currentColor"`), so the active tab's existing `color: var(--navy)` /
  hover-gold styling now reaches the icon too, which emoji structurally couldn't do.
- **3.3** — `Header.astro`'s script: added a real focus trap (Tab/Shift+Tab cycle inside
  the panel while open), Escape closes it, focus returns to the toggle button. Opening
  the panel now also moves focus to its first link, which is what makes "trapped" mean
  anything the moment a keyboard user opens it.
- **3.4** — `navigation.ts`: deleted the hardcoded six-section fallback now that Strapi
  actually holds real navigation data (decision 023) — an empty Strapi response now
  renders an empty menu, not a plausible-looking fake one, per the plan's own reasoning
  for this step.

**Verification — actually exercised, not just read back.** The Browser pane here can't
composite visual frames (screenshots time out), so verification used `read_page` plus
direct `javascript_tool` DOM/event simulation instead of screenshots — a real constraint
worth recording for whoever picks this up next in this same environment. Confirmed
against the running dev server, not just the source:
- 375px: six items correctly absent from `.primary-nav` (`display:none`), hamburger
  present, all four bottom tabs present and pointing at real routes.
- Clicking the toggle: `aria-expanded` flips, panel un-hides, **focus lands on "About"
  automatically** — all 6 real seeded labels present in DOM order (About, Academics,
  Admissions, Research, Student Life, News & Notices).
- Dispatched a real `Escape` keydown: panel closes, focus lands back on the toggle button
  — checked via `document.activeElement === toggle`, not assumed.
- Dispatched real `Tab` and `Shift+Tab` keydowns from the last/first link: focus wraps to
  the first/last item respectively — the actual trap behaviour, not just that the
  listener exists.
- 760px (the fix that matters most): `.primary-nav` visible, hamburger and bottom-tabs
  both hidden, all six links present, `primaryNavRect.right` (736px) stays inside the
  wrap's right edge (760px) — verified no overflow, not eyeballed.
- 1024px: gap genuinely widens to 32px and font to 0.92rem as the third media-query
  layer intends; still no overflow.
- 1280px: same, hamburger/bottom-tabs still correctly hidden.
- Bottom-tab icons: confirmed real `<svg>` elements (not broken emoji-replacement), 22×22,
  computed `color` resolves to `rgb(13, 27, 75)` (`--navy`) on the active Home tab —
  `currentColor` inheritance confirmed working, not assumed from the CSS alone.
- `npm run build` output (`dist/index.html`) checked directly, not just dev mode — the
  SVG icons and real nav labels are baked into the actual production HTML.
- Console: zero errors at any tested width.

**Consequences:** Phase 3 is done. The one thing not verified: this environment can't
render the panel visually, so a human should still eyeball it once — the DOM-level
behaviour is confirmed correct, but "does it *look* right" wasn't and can't be checked
from here.

---

## 027 — Phase 4: two real photo-consent bugs found and fixed; the rest is genuinely blocked on content, not more auditing

**Status:** Decided

**Context:** Phase 4 asks for templates checked in three states, photo shapes enforced,
consent verified working, and page weight re-checked with real content. Audited the
actual code against each, rather than assuming decision 018's original verification
(against placeholder content, before the Track A/B loss-and-recovery of decisions
020/021) still holds.

**4.3 (photo consent) — two real bugs found and fixed, not assumed clean.**
`web/src/lib/content/people.ts`'s `mapCard()` was exposing `photo_url` unconditionally —
`photo_consent` was never checked anywhere in the file, despite the field existing on the
`person` schema exactly as decision 006 specified. A second, identical leak existed in
`features.ts`'s `related_people` mapping. Both fixed: `photo_url` is now `null` unless
`row.photo_consent` is true, in both places. This is exactly the class of bug Phase 4.3
exists to catch — the schema was right, the CMS was right, the *frontend* silently
ignored the flag. Checked every other template/content module for the same pattern
(`grep` for `.photo\b` across `web/src`) — `units.ts` and `clubs.ts`/`research-centres.ts`
only ever expose `{full_name, slug}` for a related Person, never a photo, so no further
leak exists.

**4.2 (photo shapes) — mostly enforced, one real gap.** Portrait 4:5: enforced twice
(`people/[slug].astro`'s `aspect-ratio: 4/5`, and `.person .avatar`'s 88×110px box in
`components.css`, which is the same ratio expressed as fixed pixels). Unit/Feature 16:9
banners: enforced (`aspect-ratio: 16/9` in both `UnitTemplate.astro` and
`features/[slug].astro`). Homepage hero uses `min-height` + `background-size: cover`
rather than a literal `aspect-ratio: 16/9` box — a deliberate, defensible choice for a
responsive full-bleed hero (a strict ratio box crops badly on very wide or very narrow
viewports), not treated as a defect. **The real gap: 3:2 for cards/articles has nothing
to enforce yet** — checked every listing (`ListingTemplate.astro`, the programme/news
index pages) and none of them render a thumbnail image at all, despite `hero_image_url`
existing on the underlying data. Not a wrong ratio; a not-yet-built one. Left as a Phase
5 item, since there's no real photograph to size correctly until content exists anyway.

**4.1 (three states) and 4.4 (page weight) — partially verified against the one
template that actually has real content, structurally blocked for the other nine.**
`programme` is the one content type with real, pre-existing records (8 programmes, old
schema, extended per decision 015) — everything else (`unit`, `person`, `notice`,
`event`, `news`, `feature`, `page`, `club`, `research-centre`) has zero rows (confirmed
by direct query in the "what's missing" check earlier this session). Loaded
`/academics/programmes/economics/` on the running dev server and read its actual
rendered text: a real **sparse state** — half the fact-strip (award, duration, fee,
intake) renders `—`, not blank or `undefined`, and empty sections (overview, curriculum,
FAQs) are omitted entirely rather than showing empty headers. This looks deliberate, not
broken, which is what 4.1 asks for — but it's one data point out of ten templates.
Checked the built page weight directly from `dist/` (not the dev server, which carries
toolbar/HMR overhead that doesn't ship): 8.3KB HTML + 12.3KB CSS ≈ 20.5KB, comfortably
under budget and close to decision 018's original placeholder-content figures. The other
nine templates currently only exist in the **empty** state (verified: they render their
own empty-state copy — "No departments have been entered yet" etc. — correctly, not a
crash), which is one of the three states Phase 4.1 asks for, but not "full" or "sparse."

**Consequences:** Phase 4 cannot be meaningfully finished without real content — this
isn't a gap in auditing, it's the actual dependency the working plan's own phase ordering
assumes (Phase 5 feeds Phase 4's remaining verification). The natural next step is
migrating some of the real data already sitting in this same Strapi instance under the
old schema — 3 departments and **47 real faculty profiles** — into the new `unit`/
`person` types. That would simultaneously advance Phase 5 and give Phase 4.1/4.4 real
full/sparse states to check across more than one template. Not started here — a genuine
content migration is a large enough scope decision (does it start with one department,
all three, real photos with real consent, etc.) to confirm before doing.

---

## 028 — Real content migrated: all 3 departments and all 47 faculty profiles, no consent fabricated

**Status:** Decided

**Context:** Decision 027 identified that Phase 4's remaining verification was
structurally blocked — nine of ten templates had zero real records. The project owner
explicitly authorised migrating the real, pre-existing old-schema data (`department`,
`faculty-profile` — 3 and 47 records respectively) into the new schema (`unit`,
`person`, `expertise`) to unblock it.

**A real governance rule caught a real problem before it shipped, not after:** the old
`faculty-profile` schema was checked first and has **no consent field of any kind** —
neither `photo_consent` nor anything equivalent to `contact_consent` was ever captured
for these 47 real people. Setting either to `true` during migration would have been
fabricating consent that was never actually given — precisely what decision 006 and the
two bugs fixed in decision 027 exist to prevent. Every migrated person got
`photo_consent: false` and `contact_consent: false`, unconditionally, regardless of
whether a photo file exists. `email`/`phone` were left unmigrated entirely (the old data
had none filled in anyway, across all 47 records — verified by direct count, not
assumed).

**A second real governance rule caught a second real problem mid-migration:** the first
attempt to create a Unit with a reused banner-image file failed with a bare 500. Root
cause, found by testing the exact payload directly rather than guessing: the alt-text
lifecycle hook (Build Brief §03, wired into `unit`/`person` in decision 020) was
correctly rejecting the reused media — none of it has `alternativeText`, because it
predates that rule. Fixed properly, not bypassed: every reused file gets a real,
specific `alternativeText` set via Strapi's upload API before being attached
(`"Portrait of {full_name}"` for the 46 profile photos, `"{Department name} banner"` for
the one department banner that has an image) — not a generic placeholder string.

**Choice — what actually migrated, checked field-by-field before assuming completeness:**
of the old schema's ~30 faculty-profile fields, only `full_name`, `slug`, `position`
(→`designation`), `highest_qualification` (→`qualification`), `profile_picture`
(→`photo`, 46/47 records), `department` (→`unit` relation), and `employment_status`
(all 47 were `active`) had real data — verified by counting non-null values across all
47 records first, not assumed from the schema alone. `specialization` (free text, 17
records, clean short values like "Chemistry"/"Physics") became 11 unique `Expertise`
records, linked via the `specialisation` relation. `short_biography`, both email fields,
phone, office details, research/teaching text, social links, and the `publications`/
`awards` relations were 100% empty across every one of the 47 records — nothing to
migrate, not a scope cut. Department `head_of_department` was backfilled onto the new
`unit.head` (and `content_owner`) relation after all people existed, matched by the old
relation, not by name-guessing.

**Script was idempotent, not run-once-and-hope:** every step checks for an existing
record by its unique field (name/slug) before creating, so the run that failed partway
through (on the alt-text bug) could be safely re-run after the fix without duplicating
the 3 units, 11 expertise tags, or 47 people it had already created.

**Verification — rebuilt and checked the actual output, not just the API responses:**
`npm run build` went from 30 to **80 pages** (47 new profile pages + department pages
with real content + the pages that were already there). Directly `grep`ped the built
`people/karma-yoezer/index.html` for `/uploads/` — **zero matches**, confirming the
consent gate holds against real data with a real attached photo, not just in the abstract.
The placeholder (`portrait-placeholder`, "4:5") renders instead, exactly as decision 006
requires. Directly queried Strapi for people filtered by `unit.slug=humanities-social-
sciences` — 10 real names, matching what the built department page actually links to
(cross-checked by extracting every `/people/*` URL from the built HTML, not by trusting
the query alone). The Humanities & Social Sciences department page shows its real head,
Karma Yoezer, correctly. Page weight for that department page: 11.8KB HTML — still
comfortably under budget with real content and 10 real linked profiles.

**Consequences:** Phase 4.1 can now be genuinely checked in the **full** state (a
department with 10 real staff, a real head, a real banner) and **sparse** state (a
profile with only name/designation/qualification, no bio/email/phone) across the Unit and
Profile templates specifically — still not the other seven (Notice, Event, News, Feature,
Page, Club, ResearchCentre remain empty; nothing in the old schema maps to them). Every
migrated photo is real but invisible until someone with actual authority to ask these 47
people for consent does so and flips `photo_consent` in the Strapi admin — that is real,
human, outside-this-session work by design, not a follow-up task for a future coding
session.

---

## 029 — Utility bar alignment bug found and fixed with measured numbers, not eyeballed

**Status:** Decided

**Context:** The project owner compared a screenshot of the live dev server against the
old PHP site's header, asking specifically to check size/alignment (not colour or
dropdown behaviour, both already decided elsewhere) and flagged the new site as
"badly built." Screenshots aren't renderable in this environment (confirmed in decision
026), so this was checked with real computed geometry via `javascript_tool` at a 1920px
viewport instead of guessed from the description.

**Finding, with numbers:** `.utility-bar .wrap` is correctly bounded to 1140px
(`--content-width`), but its links (left-aligned, no `justify-content`) only spanned to
855.7px into it — **666.7px of dead navy space** sat unused on the right, inside the
bar's own width. The masthead row directly below it, by contrast, was already correct:
its nav ends at 1498.4px against the wrap's 1522.4px right edge (24px = the standard
edge padding). The two stacked bars didn't align with each other, which is what actually
read as "badly built" — not a colour or dropdown issue.

**Choice:** Added `justify-content: flex-end` to `.utility-bar .wrap` — the minimal fix
that directly closes the measured gap, without inventing a left-side tagline element the
old PHP header has that isn't part of what was asked (colour/dropdown/content additions
were explicitly out of scope here).

**Verification:** Re-measured after the fix — utility bar's last link now ends at
1498.4px, **exactly matching** the masthead nav's 1498.4px. Both rows now align flush at
the same right edge. Checked 375px separately to confirm `flex-wrap` still wraps cleanly
with the new `justify-content` (two rows, both still right-aligned per line, no
overlap). Confirmed the rule shipped in the actual production CSS
(`dist/_astro/Layout.*.css`), not just the dev server.

**Consequences:** None beyond the one rule — no other layout changes were made, per the
explicit "ignore colour, ignore dropdown" scope.

---

## 030 — Homepage hero video added, gated to desktop and loaded via JS, not `<source media="">`

**Status:** Decided

**Context:** The project owner pointed at the old PHP homepage's hero video for "good
vibes" and confirmed a matching video already sits in Strapi's media library (same file
as `assets/uploads/hero/hero_79333feee3ece0f709bc94df.mp4`, 2.68MB, `video/mp4`) —
verified via the upload API before doing anything, not assumed from the mention alone.
`homepage`'s schema had no video field — only `hero_images` (`allowedTypes: ["images"]`).
Added `hero_video` (`allowedTypes: ["videos"]`), which required a Strapi restart to take
effect (schema.json changes aren't hot-reloaded).

**A real cross-cutting tension, resolved deliberately, not ignored:** this project's own
stated performance philosophy (500KB budget, "a Class XII student in Samdrup Jongkhar, on
a phone, on mobile data" as the explicit test case) sits directly against autoplaying a
2.68MB video. Resolved by making the video desktop/tablet-only and never fetched on
mobile at all, not merely hidden with CSS.

**First attempt was wrong, caught by testing rather than shipped:** used `<source
media="(min-width: 760px)">` inside the `<video>` element, the standards-documented way
to do this. Tested it directly — `networkState` stayed `NETWORK_NO_SOURCE` even at
1280px, well above the breakpoint. The media-query gate on `<video>`'s `<source>` did not
behave as documented in this environment. Replaced with a small script (same
budget-exempt-interaction class as the mobile menu toggle and calendar filter chips): the
video ships with no `src`/`autoplay` attribute at all; a script checks `matchMedia('(min-
width: 760px)')` and `matchMedia('(prefers-reduced-motion: reduce)')` and only then sets
`.src` and calls `.play()`. Verified this actually stops the fetch, not just the
attribute: at 375px, `networkState` is `0` (`NETWORK_EMPTY`) and `currentSrc` is empty —
no request made. At 1280px, real range-request (`206 Partial Content`) traffic for the
video file is visible in the network log.

**A second real bug, also caught by testing rather than assumed working:** the first
version of the script called `.play()` in the same tick as setting `.src`, which silently
lost a race against the browser registering the new source — verified: the video loaded
fully (`readyState: 4`) but stayed paused, and a script correction confirmed a later,
separately-called `.play()` succeeded, isolating the timing bug rather than the browser
autoplay policy. Fixed with a `.load()` call plus a `canplay` listener as a second attempt,
alongside the immediate one. Re-verified on a fresh page load with the tab actually in the
foreground (a background tab in this multi-tab session paused the video after ~5s, which
is normal browser tab-throttling behaviour, not a site defect) — `currentTime` genuinely
advancing, `paused: false`.

**Not independently re-verified:** the `prefers-reduced-motion` branch uses the identical
`matchMedia(...).matches` gate already proven to work for the width check, but this
environment has no way to emulate that OS-level preference from page script to force a
fresh-navigation test of it specifically — noted rather than claimed as tested.

**Consequences:** No `hero_images` or `statement` is set on the homepage record yet — the
navy background colour shows before the video loads, and the default English statement
text is used. Not addressed here; adding a real hero photo/statement is separate content
work, not part of what was asked.

---

## 031 — Masthead enlarged (crest + nav), scope confirmed before touching the colour decision

**Status:** Decided

**Context:** The project owner shared RUB's header (white background, large circular
crest badge, spacious nav) as a "look how good this looks" reference. RUB's background
is white; ours is navy, locked in by decisions 001/017. Asked directly which was wanted
— a same-colour size/spacing increase, or an actual reversal of the navy decision — before
touching anything, since the two are very different in scope. Confirmed: keep navy, make
the crest bigger and the nav row more spacious. No colour or structural change made.

**Choice:** `Header.astro`'s crest grew from 32px to 56px (both the `<Image>` component's
width/height props and the CSS, kept in sync so Astro's image pipeline generates the
right size rather than upscaling a smaller render). `.masthead .wrap`'s padding grew in
three tiers, mobile-first (`--s4` base → `--s5` at 760px → `--s6` at 1024px), rather than
one flat value, so the masthead gets progressively roomier rather than just uniformly
bigger everywhere including cramped mobile widths. `.brand-text` grew 1.05rem→1.2rem,
`.primary-nav a`'s font-size and padding grew at the 1024px+ tier specifically
(1.02rem, `--s4` vertical padding, `--s7` gap) — deliberately not at the 760px tablet
tier, where six nav items were already close to the wrap's edge after decision 026's
breakpoint fix.

**Verification, not assumption, given the tablet tier was already tight:** re-measured at
all four of the plan's standard widths after the change. 760px: no overflow, no
brand/nav collision (nav starts at 227px, brand ends at 211px). 1024px: no overflow,
confirmed nav font actually is 16.32px (1.02rem) and logo actually renders at 56px, not
just requested. 1280px: no overflow, and — checked specifically because decision 029 just
fixed this — the utility bar's last link and the primary nav's right edge are still
exactly aligned (both 1178.4px), confirming the bigger masthead didn't quietly break that
fix. 375px: no brand/toggle collision, masthead height 94px (was ~66px), still reasonable
for a phone. Also confirmed the 1.6MB source PNG still compresses to ~2KB WebP at the
larger display size — the bigger crest costs nothing in the performance budget.

**Consequences:** None beyond the masthead — no other layout or colour changes were made,
matching the confirmed scope.

---

## 032 — Logo-only brand mark, evenly-distributed nav, real header search — three rounds of scope clarification, then two real bugs caught in verification

**Status:** Decided

**Context:** The project owner's first message ("nothing written near the logo") directly
contradicted their own follow-up answer ("logo should contain... sherubtse college
kanglung"). Rather than guess which was meant, asked directly — confirmed: logo image
only, no text. Search behaviour also needed a second clarifying round: offered a live
dropdown vs. a plain redirect, the owner picked neither ("something else") and supplied
a real reference URL (`rub.edu.bt/?s=programmes...`). Fetched and read that page rather
than guessing what "like this" meant: a full-page-reload results list — title, excerpt,
link, no live dropdown, no thumbnails.

**Choice:**
- `Header.astro`: removed the `<span class="brand-text">` entirely — crest image only,
  `aria-label` moved to the link itself so the accessible name isn't lost.
- Added a real `<form action="/search" role="search">` after the nav — plain GET,
  works with JavaScript disabled, submits to the site's existing Pagefind-powered
  `/search` page. Positioned after "News & Notices" per the owner's explicit placement
  instruction.
- `.primary-nav` changed from a fixed `gap` to `flex: 1` + `justify-content: space-between`
  — the six links now genuinely spread across whatever room is left between the logo and
  the search box, not clustered with uniform-but-arbitrary spacing.
- `search.astro`: reads `?q=` off the URL on load and drives it into Pagefind's own input
  (`dispatchEvent(new Event('input'))`) so the masthead search box's query lands the
  visitor on populated results, not an empty search box they'd have to retype into —
  the closest honest match to the RUB reference's "type once, see results" flow, built on
  the site's real (better — live, no reload) search technology rather than copying
  WordPress's page-reload mechanism.

**Two real overflow bugs, found by measuring, not by looking:** first pass overflowed at
760px (search box 89px too wide for what was left after the logo and six links).
Fixed by shrinking the search input at that tier and tightening the nav's own margin —
re-measured, fit with 5px to spare. Second pass then overflowed at 1024px (a `margin-
inline: var(--s7)` left over from decision 031, now competing with a wider 200px search
box for the same space) — removed that margin entirely, since the "bigger" feel at that
tier was already coming from the links' own font-size and padding, not extra margin.
Re-verified all four standard widths after both fixes: 375px (search correctly hidden,
no collision with the hamburger), 760px, 1024px, and 1280px (search box lands at
1178.4px — the same right edge decision 029 established for the utility bar) all clean,
with nav gaps confirmed genuinely equal at each width measured (31px at 1280px before
the 1024px fix, 45px after — the point being they're equal to each other at any given
width, not a fixed value across widths).

**A tooling-fidelity finding, isolated rather than assumed to be a site bug:** the
Browser pane's synthetic mouse click and Enter keypress did not focus the input or
submit the form here, even after confirming coordinates were correct. Rather than
conclude the feature was broken, isolated the cause: JS `.focus()` genuinely focused the
input, and after that, typed text landed correctly — the click specifically wasn't
registering as a real focus event in this non-compositing pane. `button.click()` (a real
DOM click, not a bypass like `.submit()`) fired a real `submit` event and navigated
correctly to `/search?q=Physics`. This is a standard HTML form with one input and one
submit button — that combination submits on Enter in every real browser natively, with
or without JavaScript; nothing in this codebase's scripts touches this form's keydown
events. Verified the actual outcome twice with different real queries against the real
migrated data: "Economics" → 6 results including Karma Yoezer and Ugyen Lhendup's real
profiles (both have "MA Economics" as their qualification); "Physics" → 9 results
including three real Physics faculty and the BSc Physics programme.

**Consequences:** `npm run build` (the full script, including `pagefind --site dist`)
must be run for search to work at all — plain `astro build` alone (what most of this
session's other verifications used) does not generate the Pagefind index, and the dev
server (`astro dev`) never serves it either. A new `astro-web-preview` entry was added to
`.claude/launch.json` (port 4322) specifically to test against the real built output —
worth keeping for any future verification that depends on Pagefind or other
build-only artifacts.

---

## 033 — Masthead widened past --content-width; logo/search resized in three tiers, not one

**Status:** Decided

**Context:** The project owner asked why the masthead's content "appears in the middle"
on their screen. Measured rather than assumed: at 1920px, `.masthead .wrap` inherited
the site's shared `--content-width` (1140px, tuned for reading body text), leaving
382px of dead navy on each side — real and symmetric, confirmed by
`getBoundingClientRect`. Also asked for the logo bigger and the search box shorter,
opposite directions on the same element decision 031/032 had just sized.

**Choice — widen the chrome, not the whole site.** A nav bar reading as a solid band and
a paragraph of body text have different jobs; capping both to the same 1140px isn't
required by anything in the Style Guide, it's just what the shared `.wrap` class does by
default. Added `max-width: 1600px` scoped to `.utility-bar .wrap` and `.masthead .wrap`
only — a real cap, not full-bleed, so it doesn't stretch absurdly on an ultra-wide
monitor, but uses much more of a normal wide screen. `--content-width` itself (used
everywhere else — articles, cards, listings) was left untouched.

**A real bug found while resizing the logo, not assumed fixed by editing CSS alone:**
the `<Image>` component had an inline `style="height:80px"` left over from decision 031.
Inline styles beat any external stylesheet rule regardless of specificity tricks, so
every `.brand img` media-query rule written for this change would have silently done
nothing — confirmed by checking the rendered height at each breakpoint before assuming
the CSS took effect. Removed the inline style entirely; sizing now lives only in CSS,
where it can actually differ by breakpoint: 44px base, 60px at 760px, 80px at 1024px+
(matching the same three-tier mobile-first pattern used everywhere else in this file,
not a flat value).

**Two more overflow bugs, same tight 760px tier as before:** the first attempt (widen +
80px logo everywhere + 140px search) overflowed 760px by 19px — the bigger logo alone
cost more than the margin decision 032 had left. Fixed by keeping the logo modest (60px)
at that specific tier and shrinking the search input further there (90px → 70px) — the
same "big only from 1024px+" principle already applied to the nav font/padding. Re-
verified all five widths after: 375px (44px logo, no hamburger collision), 760px (21px
margin, up from the previous fix's precarious 5px), 1024px (80px logo, 24px margin),
1280px (still aligned with the utility bar), 1920px (dead space 382px → 152px per side,
nav gaps still equal at 144px, search confirmed 140px wide, logo confirmed 80px — not
just requested, measured).

**Consequences:** None beyond the masthead/utility bar — `--content-width` and every
other section of the site keep their existing 1140px reading measure.

---

## 034 — Phase 2 closure: real redirect map for all 205 audited old-site URLs

**Status:** Decided

**Context:** A stale status snapshot shown by the project owner claimed Phase 3 was
still broken (emoji icons, 1024px breakpoint) and that decisions 008/009 were still
open — checked both directly against the real code and this log: `BottomTabs.astro`
already uses inline SVG and the breakpoint is already 760px (decision 026), and
008/009 were confirmed by the project owner back in decision 024. The one genuinely
remaining Phase 2 gap, confirmed by re-reading decision 025's audit output, was that
the 205 classified URLs had never been turned into an actual redirect mechanism.

**Choice:** Generated `web/src/data/redirects.json` (203 entries) directly from
`docs/Sherubtse-Content-Audit-v5.xlsx`'s Move/Merge/Retire/target columns — no new
classification decisions, just wiring up what decision 025 already decided. Wired it
into `astro.config.mjs`'s built-in `redirects` option. Excluded two rows: the one
Elementor widget URL explicitly marked "not indexable, no redirect needed," and the
homepage's own row (`/` → `/`, not a real redirect).

**A real data bug caught before shipping:** 37 of the spreadsheet's target URLs had a
stray trailing slash (`/academics/programmes/` etc.) that wouldn't have matched the
site's actual no-trailing-slash routes. Fixed programmatically during generation, then
verified all 27 unique targets against the real `src/pages` route structure.

**Verified with a real build, not assumed from config alone:** `npx astro build`
produced 80 pages plus 203 static redirect stubs with no errors. Spot-checked
`dist/management-team/index.html` directly — correct `meta http-equiv="refresh"`,
`rel="canonical"`, and `noindex`, pointing at `/about/about-the-college` as classified.

**A known, pre-existing gap this surfaces rather than creates:** five of the redirect
targets (`/about/about-the-college`, `/about/history`, `/about/vision-mission-core-
values`, `/about/campus-facilities`, `/about/contact`) route through `about/[slug].astro`,
which currently generates zero paths — Strapi's `pages` collection has 0 records. The
redirect targets are correct; they'll resolve once Phase 5 seeds real Page content.
Not fabricating that content now.

**Consequences:** Static-host meta-refresh redirects return HTTP 200, not a real 301 —
adequate for functionality and works with JS off, but a real 301 (via `.htaccess` or a
hosting platform's redirect config) is still worth doing at Phase 6 launch time for SEO
link-equity transfer. Left as a Phase 6 note, not solved here.

---

## 035 — Phase 5 begun: real Pages, Research Centres, and Clubs — sourced from the live
site, not fabricated

**Status:** Decided

**Context:** Phase 5 (load real content) had zero records in `pages`, `clubs`, and
`research-centres` — the department/faculty migration (decision 028) never covered
these. Decision 025's audit had already identified real named entities for both
(4 research centres after deduplication, ~20 real clubs), so rather than invent
placeholder content, fetched each entity's actual live page on www.sherubtse.edu.bt
and used only its genuine, verifiable text.

**Choice:**
- Created 4 new `Unit` records to serve as real `owning_unit`s, since none of the
  existing 3 academic departments fit: **Office of the President** (owns the 5 About
  pages below), **Office of Research and Industrial Linkages** (owns the research
  centres), **Student Association** (owns the clubs), and **Games & Sports** (recorded
  per decisions 009/011/024's classification, no content beyond the Unit record itself
  — still flagged as needing a dedicated frontend route per the Phase 4 note in
  decision 025).
- 5 `Page` records for the About section, closing the redirect gap decision 034
  flagged: About the College (leadership names/titles, sourced from the site's own
  Contact page rather than Management Team, whose bios are the site's known "Duden
  river" Lorem-Ipsum placeholder — explicitly excluded, not reproduced), History (the
  real 1968–2021 timeline), Vision/Mission/Core Values, Campus Facilities
  (library/lab), and Contact.
- 4 `Research Centre` records (Population & Development Studies, Climate Change &
  Spatial Information, Science & Environmental Research, Business Incubation Centre),
  each with its real vision/mission/focus-area text and named coordinator. Skipped
  "FINA" — decision 025 flagged it as a duplicate needing disambiguation with a real
  person, still unresolved.
- 20 `Club` records, one per real club/society page found in the audit. Verified each
  page individually before writing a description, rather than trusting the audit's
  slug-derived name alone — two pairs (Y-VIA vs. Y-PEER Network, Science Forum vs.
  Social Science Forum) were checked specifically for being duplicates and confirmed
  distinct. Coordinator/student-lead names were left blank wherever the live page
  didn't name one, rather than invented.

**A real bug caught by verifying the build, not the API response:** all 28 new
records (4 units, 4 centres, 20 clubs) came back with `slug: null` — Strapi 5's `uid`
field only auto-generates through the admin-panel content-manager, not the plain REST
API used here. The existing department/programme data has real slugs because an
earlier session's migration script set them explicitly; this script didn't. Fixed by
slugifying each `name` and `PUT`-ing it back per record. Confirmed with a real
`astro build` (111 pages, up from 80) and by reading the actual rendered output of a
club page, a research-centre page, and the two listing pages — real names, categories
and descriptions in place, not just present in the API.

**Consequences:** `notices`, `events`, `features`, and `recruitments` are still at
zero records — unlike Pages/Clubs/Research Centres, most of the audit's matching old
URLs are already-expired notices (decision 025's ~100 "Retire" rows), where the audit
only captured a title/slug, not real body text, so seeding them properly means
fetching each one individually rather than reusing this session's approach directly.
Left for a following pass.
