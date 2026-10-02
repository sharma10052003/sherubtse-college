# Strapi admin guide

## How the sidebar is organised

Strapi cannot nest content types in folders, so every type starts with the
page it belongs to. Sorted alphabetically, each page's content sits together:

| Prefix | What is inside |
|---|---|
| **Global –** | Header & Navigation (logo, menu, search text), Footer (text, links, map), Site Settings (name, contact details, SEO defaults, social links) |
| **Home –** | Page |
| **About –** | Overview, The College, Leadership, History (page, timeline, traditions, legacy, gallery), Text Pages, Faculty (page, profiles, expertise, awards), Administrative Units, People Directory |
| **Academics –** | Overview, Programmes, Departments, Calendar Entries, Guide |
| **Admissions –** | Overview |
| **Alumni –** | Page, Profiles & Stories, Achievements, Chapters, Gallery, Registrations |
| **Contact –** | Page, Offices, Enquiries |
| **News & Notices –** | Overview, News, Notices, Announcements (banner strip), Vacancy Announcements, Events, Recruitment, Downloads & Forms, Features |
| **Newsletter –** | Editions, Topics, Subscribers |
| **Research –** | Overview, Centres, Publications |
| **Student Life –** | Overview, Clubs |

Single types (one per page) appear under **Single Types**; repeating items
(news, events, profiles…) appear under **Collection Types**.

### Overview pages and sections

Each section landing page (About, Academics, Admissions, Research, Student
Life, News & Notices) has an **Overview** entry: eyebrow, heading, intro, the
list of **cards**, and a **Sections** area below them. In Sections an editor
can add, remove and reorder *Text Block*, *Image and Text* and *Call to Action*
blocks. Nothing on these pages is hard-coded.

### Home and Alumni pages

**Home – Page** holds the hero (eyebrow, heading, statement, buttons, images/video), the President message, the announcements and events headings, the *Explore* cards and an editor-built **Sections** area. Announcements and events themselves come from **News & Notices – Notices / Events**.

**Alumni – Page** holds all the wording on the Alumni page: each section (hero, about, why alumni matters + its four cards, distinguished alumni, stories, story form, events, mentorship, global reach, gallery, achievements, register, newsletter, contact + contact details), the small labels, empty-state messages, consent texts and form success messages. Only the form field labels (Full Name, Email, …) stay in the code because they are tied to what the form saves.

### Announcements page (vacancy postings)

The public **Announcements** page (`/news-notices/announcements`) is driven entirely by **News & Notices – Vacancy Announcements**. This is a different type from **News & Notices – Announcements**, which is an unrelated dormant site-wide banner strip — don't confuse the two in the sidebar.

To post a new announcement, create an entry with:

- **Title**
- **Type** — Vacancy Announcement, Re-Vacancy Announcement, Shortlisted (Written), Shortlisted (Viva-Voce), Selection Result, or General Notice
- **Position name** (optional — not every General Notice has one)
- **Date posted** (defaults to today if left blank)
- **Deadline or interview date** (optional)
- **Description** (rich text — the main notice text; supports headings, bold and lists)
- **Attachment** (optional — a PDF is viewable inline and downloadable on the detail page)
- **Status** — Open or Closed

Two more sets of fields cover the two shapes these postings actually come in, both optional and both repeatable, so an entry can have as many rows as it needs (or none):

- **Position Openings** — for Vacancy/Re-Vacancy Announcements that advertise one or more posts: Particular, Position Title, Position Level, Slots, Mode of Employment, Eligibility Criteria. Rendered as a table.
- **Shortlisted Candidates** — for Shortlisted (Written)/(Viva-Voce): Position Title, CID Number, Contact Number, Score, Remarks. When a posting covers more than one position, rows are grouped under that position automatically based on the Position Title text, matching how the College's own shortlist notices are laid out. Also add **Interview Time** and **Interview Venue** for these.
- **Additional Notes** (rich text) — the closing "important notes" paragraph(s), kept separate from the main Description.

There is no publish step: saving the entry makes it appear on the page immediately, newest first by date posted. Visitors can filter by type and search by title/position on the listing page. Each entry gets its own page automatically at `/news-notices/announcements/<slug>`, built from the title.

The **Tenders** page and its detail links are unaffected — they still come from **News & Notices – Notices** (category "tender").

## Users and roles

Settings → Administration Panel → **Users** to create, edit, deactivate or
delete people; **Roles** to change what a role may do. Every edit is stored
with the author's name (shown as *Created by / Updated by* on each entry).

Roles created automatically the first time Strapi starts:

| Role | Can do |
|---|---|
| Super Admin | Everything, including users, roles and settings (built in) |
| Website Manager | Create, edit, delete and **publish** every page. No users/roles/settings |
| Content Author (Draft Only) | Create and edit anything. **Cannot delete or publish** |
| Viewer | Read only |
| *One editor role per page group* — Alumni Editor, Academics Editor, About Editor, Admissions Editor, Contact Editor, Global Editor, Home Editor, News & Notices Editor, Newsletter Editor, Research Editor, Student Life Editor | Create, edit, delete and publish **only** that group's types. Read-only access to content types they link to (for example Units), so relation pickers work |

A user can have several roles. To let someone draft but not publish, give them
*Content Author (Draft Only)* (or untick **Publish** on their role).

Types a role has no permission for are hidden from that user's sidebar.

Roles are only created if missing, so changes made in the admin are kept. After
adding new content types, run Strapi once with `SYNC_ADMIN_ROLES=true` to rebuild
the roles above from the current types (this overwrites edits to those roles).

## Limits of the Community edition

Review workflows and audit logs need a paid plan. Who changed what is still
visible per entry (Created by / Updated by).

## Old PHP-era content

Data from the content types that only the retired PHP site used is kept in
`legacy-archive/php-era-content-types.json`.
