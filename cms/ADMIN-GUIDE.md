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
| **News & Notices –** | Overview, News, Notices, Announcements, Events, Recruitment, Downloads & Forms, Features |
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
