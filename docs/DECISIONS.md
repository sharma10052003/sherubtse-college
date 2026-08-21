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

## 008 — OPEN: International Student section modelling
**Status:** Open — blocks M1

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

## 009 — OPEN: Games & Sports classification
**Status:** Open — blocks M1

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
**Status:** Decided by default — reversible if IT Section objects

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
**Status:** Decided by default — reversible if IT Section objects

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
