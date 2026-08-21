# Content Model Reference

The implemented Strapi content model for the CMS rebuild described in the Website Build
Brief, Visual Style Guide, and Project Plan. This is Track A's own listed deliverable
("Content model reference documentation") — it documents what's actually built, not the
brief's original tables verbatim, so field names here are the source of truth going
forward. See `../../docs/DECISIONS.md` for the reasoning behind each naming choice.

**Status:** additive build alongside the pre-existing schema that still powers the live
PHP site (`department`, `faculty-profile`, `programme` [extended, not replaced], etc.).
Nothing pre-existing was renamed or removed — see `docs/DECISIONS.md` #001.

## Naming resolutions (differ from the brief's own wording)

| Brief's term | Technical name | Why |
|---|---|---|
| Announcement | `notice` | `announcement` already existed (scrolling ticker/banner, unrelated shape) — kept, brief's type built as `notice` instead. |
| Programme (as a 13-type-list entry) | `programme` (extended) | Already existed with 8 real seeded records — extended in place rather than duplicated. |
| — | `news` (singular) / `news-entries` (plural) | Strapi requires singular ≠ plural even within one type; "news" has no natural distinct English plural, so the REST collection route is `/api/news-entries` while the admin-panel display name is simply "News". |

## Collection types (14)

Every type below carries `draftAndPublish: true` and, unless noted, the governance
fields required by Build Brief section 03 — `owning_unit` (relation → Unit, required),
`last_reviewed` (date, required), `review_interval` (enum: semester/annual/none).
`expires_at` (datetime) is **required** on Notice, Event, Recruitment; **optional** on
Programme, CalendarEntry, News, Document, ResearchCentre, Club; **absent entirely** on
Feature, Expertise, Alumni, Page, Unit (time-unbound by nature).

| Type | Technical name | Notable fields beyond the standard set |
|---|---|---|
| Unit | `unit` | `kind` enum (academic/administrative/research_centre/student_body), `head`/`content_owner` → Person, `contact` (ContactBlock). Uses `content_owner` instead of `owning_unit` — a Unit doesn't own itself. No `review_interval`. |
| Person | `person` | `unit` → Unit, `specialisation` → Expertise (many), `publications` (repeatable), `contact_consent` + `photo_consent`/`photo_consent_date` (Photography Brief decision 006), **`employment_status`** enum (active/on_leave/departed) — named this, not `status`, because `status` is a Strapi-reserved field name when `draftAndPublish: true`. No governance trio (Person isn't "owned content" the same way). |
| Notice | `notice` | `category` enum, `audience` — stored as **`json`** (array of strings), since Strapi has no native multi-select enum field type. `featured_for_international` (decision 012). |
| Recruitment | `recruitment` | `stage` enum, `apply_url` (audit finding — every live vacancy links to RUB's IMS), `stage_documents` (repeatable, `shared.stage-document` component: stage/label/file/date_posted). |
| Programme | `programme` (extended) | Existing fields kept as-is. Added: `unit` → Unit, `coordinator` → Person, `annual_fee`, `intake_status`, `featured_for_international`. `owning_unit`/`last_reviewed` left **optional** here (not required) since 8 real records already exist without them — new types get `required: true`, this extended one doesn't, to avoid blocking ordinary edits to existing programmes. |
| CalendarEntry | `calendar-entry` | `applies_to_programmes` → Programme (many), `related_announcement` → Notice. |
| Event | `event` | `open_to` enum. |
| News | `news` (route: `news-entries`) | See naming table above. |
| Document | `document` | `source_note` (audit finding — provenance for items migrating from personal/third-party hosting). |
| ResearchCentre | `research-centre` | `lead` → Person, `members` → Person (many), `focus_areas` → Expertise (many). |
| Club | `club` | `coordinator` → Person. |
| Alumni | `alumni` | Only `owning_unit` + `last_reviewed` — no `review_interval`, no `expires_at` (profiles don't expire or need a review cadence the same way live content does). |
| Expertise | `expertise` | Controlled vocabulary — no governance fields at all (a tag list, not owned content). |
| Page | `page` | **Create permission restricted to Super Admin.** No `expires_at`. |
| Feature | `feature` | The 10th template (Stack/IA/Wireframes §07) — decision 016 reconciled the field set against this fuller spec, superseding Track A's original Photography-Brief-only version. `standfirst` (required), `author` → Person + `author_name` (free text alternative for student writers), `body` (richtext, inline images/pull quotes), `theme` enum, `related_people`/`related_units` (many-to-many). `reading_time` is **not** a schema field — computed at Astro build time from `body`. Only `owning_unit` + `last_reviewed`, explicitly **no expiry** — evergreen by design. Publishing rule (editorial, not schema): quota not cadence, 4-6/year, doesn't go live until 3 finished pieces exist. |

## Single types (3)

| Type | Technical name | Fields |
|---|---|---|
| Homepage | `homepage` | `hero_images` (multiple, supports the Photography Brief's 3-4 seasonal options), `statement`, `quick_links`/`featured_selections` (repeatable `shared.link-item`). Create restricted to Super Admin. |
| SiteSettings | `site-settings` | `address`, `phones`/`official_emails` (**`json`** arrays — same multi-value workaround as Notice.audience), `footer_link_groups` (repeatable `shared.link-group`), `subdomain_links` (repeatable `shared.link-item` — the 7 subdomains found in the audit crawl). |
| Navigation | `navigation` | `menu` (repeatable `navigation.nav-item`: label/url/children). Max-6-top-level / max-8-second-level is **editorial policy, not a schema constraint** — Strapi doesn't validate array length natively. Create restricted to Super Admin. |

## Components

**`shared.*`**: `contact-block` (email/phone/office/hours), `attachment` (label/file),
`publication` (citation/year/link), `seo` (title/description/og_image), `link-item`
(label/url), `link-group` (label + repeatable link-item), `stage-document`
(stage/label/file/date_posted).

**`navigation.nav-item`**: label/url/children (repeatable `shared.link-item`) —
Navigation-specific.

**Pre-existing, reused as-is**: `shared.button`, `shared.faq-item`, `programme.curriculum-block`.

## Alt-text validation

Build Brief section 03 requires alt text on every media upload before publication.
Strapi has no native field-level validation for this — implemented as a shared lifecycle
utility, `src/utils/require-alt-text.ts`, wired into `beforeCreate`/`beforeUpdate`
lifecycle hooks on every type with a direct **image** media field: Unit, Person, News,
Club, Alumni, Feature, Homepage, and Programme (extended, for consistency). Media nested
inside repeatable components (Notice.attachments, Recruitment.stage_documents) is **not**
checked — those are downloadable files, not images alt text is meant for.

## Roles — manual Strapi Admin setup (not version-controlled)

Strapi's built-in roles already match the brief's Super Admin / Publisher / Contributor
split almost exactly — no custom role or Enterprise RBAC needed:

| Brief's role | Strapi's built-in role | Action needed |
|---|---|---|
| Super Admin | Super Admin | None — already correct. |
| Publisher | Editor | Rename display label to "Publisher" in Settings → Administration Panel → Roles. |
| Contributor | Author | Rename display label to "Contributor" in the same screen. |

**Then, for both Publisher and Contributor roles**, set `create` permission to **off**
for: `Page`, `Homepage`, `Site Settings`, `Navigation` — these four stay Super-Admin-only
to create, per the brief.

This is a checklist for whoever has Strapi Admin access to run through once — it isn't
schema, so it can't be scripted/committed the way the content types above are.

## Explicitly out of scope for this pass

- Publish webhook to a build pipeline (no pipeline exists yet — Astro not scaffolded,
  hosting undecided).
- Expiry logic + the monthly review-reminder job (needs somewhere to run — same hosting
  dependency).
- Retiring the pre-existing content types — stays until the Astro frontend (Track B)
  actually replaces the PHP site.
- Seeding real content into the new types (Project Plan Track C).
