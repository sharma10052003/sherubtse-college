-- =============================================================
-- Sherubtse College Homepage — Database Schema
-- -------------------------------------------------------------
-- Module 1: Foundation + Hero Section.
-- Run once against a fresh MySQL database, e.g.:
--   mysql -u root sherubtse_college < database/schema.sql
-- (create the database first: CREATE DATABASE sherubtse_college
--  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;)
--
-- Every later homepage section (News, Events, Gallery, ...) adds
-- its own tables in its own migration file under this same folder;
-- `site_settings` is the one shared table every section's admin
-- page reads/writes global design tokens from.
-- =============================================================

SET NAMES utf8mb4;

-- -------------------------------------------------------------
-- admin_users — session-based auth. `role`/`is_active` support
-- multi-role access later; this module only ever checks that a
-- row exists with a matching password (single-admin usage today).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('admin','editor','viewer') NOT NULL DEFAULT 'admin',
    is_active     TINYINT(1) NOT NULL DEFAULT 1,
    last_login    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default account: username "admin", password "Sherubtse@2026".
-- CHANGE THIS PASSWORD IMMEDIATELY after first login — this hash is
-- published in this repo's schema file.
INSERT INTO admin_users (username, email, password_hash, role)
VALUES ('admin', 'admin@sherubtse.edu.bt', '$2y$10$mv8Qk59qIud6jgju.m2tDermTgM38P7JLXuXwT3yFW7qjdLJOu/l2', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- -------------------------------------------------------------
-- site_settings — global design-token store (flexible key/value,
-- "options table" pattern). Read by includes/theme.php on every
-- page load and written by admin/sections/theme.php. `setting_group`
-- is free for later admin-UI grouping; nothing requires it yet.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    setting_key   VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    setting_group VARCHAR(50) NULL,
    is_json       TINYINT(1) NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed values mirror the maroon/gold palette already defined in
-- assets/css/variables.css, so enabling the CMS does not change
-- the live site's look until the admin actually edits a value.
INSERT INTO site_settings (setting_key, setting_value) VALUES
    ('color_primary',        '#7A1B2B'),
    ('color_secondary',      '#4E1019'),
    ('color_accent',         '#C7962C'),
    ('color_accent_light',   '#E8C97A'),
    ('color_background',    '#FAF7F1'),
    ('color_background_alt','#F3EEE4'),
    ('color_card',           '#FFFFFF'),
    ('color_text',           '#221A17'),
    ('color_text_soft',      '#5B4E48'),
    ('color_border',         '#E4DCD1'),
    ('color_button_text',    '#FFFFFF'),
    ('color_hover',          '#E8C97A'),
    ('gradient_start',       '#7A1B2B'),
    ('gradient_end',         '#C7962C'),
    ('hero_overlay_color',   '#221A17'),
    ('hero_overlay_opacity', '55'),
    ('dark_background',     '#1B1412'),
    ('dark_background_alt', '#241A17'),
    ('dark_card',            '#241A17'),
    ('dark_text',            '#F3EEE4'),
    ('dark_text_soft',       '#C9BCB3'),
    ('font_heading',         'Fraunces'),
    ('font_body',            'Public Sans'),
    ('radius_card',          '18'),
    ('radius_button',        '10'),
    ('shadow_style',         'soft'),
    ('animation_speed',      'normal'),
    ('container_width',      '1240'),
    ('spacing_scale',        'comfortable')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- -------------------------------------------------------------
-- hero_content — single-row table for the cinematic hero banner.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_content (
    id               TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title            VARCHAR(200) NOT NULL,
    subtitle         VARCHAR(400) NOT NULL,
    cta1_text        VARCHAR(60)  NOT NULL,
    cta1_url         VARCHAR(255) NOT NULL,
    cta2_text        VARCHAR(60)  NOT NULL,
    cta2_url         VARCHAR(255) NOT NULL,
    background_type  ENUM('gradient','image','video') NOT NULL DEFAULT 'gradient',
    media_path       VARCHAR(255) NULL,
    overlay_style    ENUM('maroon','dark','light') NOT NULL DEFAULT 'maroon',
    overlay_opacity  TINYINT UNSIGNED NOT NULL DEFAULT 55,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_hero_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO hero_content (id, title, subtitle, cta1_text, cta1_url, cta2_text, cta2_url, background_type, overlay_style, overlay_opacity)
VALUES (
    1,
    'The Seat of Learning in the Eastern Himalayas',
    'Founded in 1968, Sherubtse College is the oldest tertiary institution in Bhutan — a constituent college of the Royal University of Bhutan shaping scholars, leaders and innovators from its hillside campus in Kanglung.',
    'Apply Now', '/admissions/apply',
    'Explore Programmes', '/academics/undergraduate',
    'gradient', 'maroon', 55
)
ON DUPLICATE KEY UPDATE id = id;

-- -------------------------------------------------------------
-- hero_items — repeatable rows for BOTH the animated stat
-- counters and the floating achievement badges (item_type
-- distinguishes them), avoiding two near-duplicate tables.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    item_type   ENUM('stat','badge') NOT NULL,
    icon        VARCHAR(60)  NOT NULL,
    value       VARCHAR(20)  NULL,
    suffix      VARCHAR(10)  NULL,
    label       VARCHAR(120) NOT NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    UNIQUE KEY uniq_type_order (item_type, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- No seed INSERT here (deliberately) — admin/ajax/hero-save.php writes
-- sort_order starting at 0 (PHP array index), so a 1-indexed seed row
-- re-run after any real admin save collides with the wrong existing
-- row on (item_type, sort_order) and silently overwrites its label.
-- includes/models/Hero.php's stc_get_hero_items() already returns
-- realistic fallback stats/badges when this table is empty, so no
-- SQL seed is needed.

-- -------------------------------------------------------------
-- gallery_content — single-row heading/intro for the Campus Gallery
-- homepage section.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_gallery_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- gallery_images — admin-uploaded campus photos. No seed rows: with
-- no real photography yet, an empty table means the public section
-- simply doesn't render (see includes/models/Gallery.php) rather than
-- showing placeholder stock imagery.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path  VARCHAR(255) NOT NULL,
    caption     VARCHAR(200) NULL,
    category    ENUM('campus','academics','events','sports','culture') NOT NULL DEFAULT 'campus',
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- HOMEPAGE CONTENT AREA — foundation for the full 13-section brief.
-- One shared registry (enable/disable, drag-reorder, scheduled
-- publish) plus a {key}_content / {key}_items pair per section,
-- following the exact pattern hero_content/hero_items and
-- gallery_content/gallery_images already established. Only
-- president_content is populated with a working admin+render this
-- pass; the rest are schema-only until their own module is built —
-- index.php's registry loop skips any section whose render file
-- doesn't exist yet (see includes/homepage.php), so seeding the full
-- registry now is safe.
-- =============================================================

CREATE TABLE IF NOT EXISTS homepage_sections (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    section_key  VARCHAR(50) NOT NULL UNIQUE,
    label        VARCHAR(100) NOT NULL,
    sort_order   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_enabled   TINYINT(1) NOT NULL DEFAULT 1,
    publish_at   DATETIME NULL,
    unpublish_at DATETIME NULL,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO homepage_sections (section_key, label, sort_order) VALUES
    ('hero',           'Hero',                        0),
    ('president',      'President''s Welcome',        1),
    ('vision_mission', 'Vision & Mission',             2),
    ('highlights',     'College Highlights',           3),
    ('events',         'Upcoming Events',              4),
    ('news',           'Latest News',                  5),
    ('academics',      'Academic Excellence',          6),
    ('statistics',     'College Statistics',           7),
    ('campus_life',    'Campus Life',                  8),
    ('research',       'Research & Innovation',        9),
    ('gallery',        'Image Gallery',                10),
    ('partners',       'International Partnerships',   11),
    ('testimonials',   'Testimonials',                 12),
    ('cta',            'Call To Action',               13)
ON DUPLICATE KEY UPDATE section_key = section_key;

-- ---- 1. President's Welcome (single row; photo/signature uploaded) --------
CREATE TABLE IF NOT EXISTS president_content (
    id             TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    name           VARCHAR(150) NOT NULL,
    position       VARCHAR(150) NOT NULL,
    message        TEXT NOT NULL,
    photo_path     VARCHAR(255) NULL,
    signature_path VARCHAR(255) NULL,
    button_text    VARCHAR(60) NOT NULL DEFAULT 'Read Full Message',
    button_url     VARCHAR(255) NOT NULL DEFAULT '/about/president',
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_president_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 2. Vision & Mission (single row, two independent card blocks) --------
CREATE TABLE IF NOT EXISTS vision_mission_content (
    id                   TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    vision_title         VARCHAR(100) NOT NULL DEFAULT 'Our Vision',
    vision_text          VARCHAR(500) NOT NULL,
    vision_icon          VARCHAR(60)  NOT NULL DEFAULT 'bi-eye',
    vision_button_text   VARCHAR(60)  NOT NULL DEFAULT 'View More',
    vision_button_url    VARCHAR(255) NOT NULL DEFAULT '/about/vision',
    mission_title        VARCHAR(100) NOT NULL DEFAULT 'Our Mission',
    mission_text         VARCHAR(500) NOT NULL,
    mission_icon         VARCHAR(60)  NOT NULL DEFAULT 'bi-bullseye',
    mission_button_text  VARCHAR(60)  NOT NULL DEFAULT 'View More',
    mission_button_url   VARCHAR(255) NOT NULL DEFAULT '/about/mission',
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_vision_mission_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 3. College Highlights -------------------------------------------------
CREATE TABLE IF NOT EXISTS highlights_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_highlights_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS highlights_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    icon        VARCHAR(60)  NOT NULL,
    title       VARCHAR(150) NOT NULL,
    description VARCHAR(300) NOT NULL,
    button_text VARCHAR(60)  NULL,
    button_url  VARCHAR(255) NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 4. Upcoming Events ----------------------------------------------------
CREATE TABLE IF NOT EXISTS events_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_events_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events_items (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path   VARCHAR(255) NULL,
    title        VARCHAR(200) NOT NULL,
    event_date   DATE NOT NULL,
    event_time   VARCHAR(60)  NULL,
    location     VARCHAR(200) NULL,
    description  VARCHAR(400) NOT NULL,
    category     VARCHAR(60)  NULL,
    is_featured  TINYINT(1) NOT NULL DEFAULT 0,
    status       ENUM('upcoming','ongoing','past') NOT NULL DEFAULT 'upcoming',
    button_url   VARCHAR(255) NULL,
    sort_order   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 5. Latest News ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS news_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_news_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news_items (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path     VARCHAR(255) NULL,
    title          VARCHAR(200) NOT NULL,
    published_date DATE NOT NULL,
    category       VARCHAR(60)  NULL,
    summary        VARCHAR(400) NOT NULL,
    button_url     VARCHAR(255) NULL,
    sort_order     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 6. Academic Excellence -------------------------------------------------
CREATE TABLE IF NOT EXISTS academics_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_academics_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS academics_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path  VARCHAR(255) NULL,
    icon        VARCHAR(60)  NOT NULL,
    title       VARCHAR(150) NOT NULL,
    description VARCHAR(300) NOT NULL,
    button_url  VARCHAR(255) NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 7. College Statistics ---------------------------------------------------
CREATE TABLE IF NOT EXISTS statistics_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_statistics_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS statistics_items (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    icon       VARCHAR(60)  NOT NULL,
    label      VARCHAR(120) NOT NULL,
    value      VARCHAR(20)  NOT NULL,
    suffix     VARCHAR(10)  NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    UNIQUE KEY uniq_statistics_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 8. Campus Life -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS campus_life_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_campus_life_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campus_life_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path  VARCHAR(255) NULL,
    title       VARCHAR(150) NOT NULL,
    description VARCHAR(300) NOT NULL,
    link_url    VARCHAR(255) NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 9. Research & Innovation ---------------------------------------------------
CREATE TABLE IF NOT EXISTS research_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_research_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS research_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    icon        VARCHAR(60)  NOT NULL,
    title       VARCHAR(150) NOT NULL,
    description VARCHAR(300) NOT NULL,
    link_url    VARCHAR(255) NULL,
    category    VARCHAR(60)  NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 11. International Partnerships ---------------------------------------------
CREATE TABLE IF NOT EXISTS partners_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_partners_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partners_items (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    logo_path  VARCHAR(255) NOT NULL,
    name       VARCHAR(150) NOT NULL,
    url        VARCHAR(255) NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 12. Testimonials -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials_content (
    id       TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title    VARCHAR(200) NOT NULL,
    subtitle VARCHAR(400) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_testimonials_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials_items (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    photo_path VARCHAR(255) NULL,
    name       VARCHAR(150) NOT NULL,
    role       ENUM('student','faculty','alumni','industry') NOT NULL DEFAULT 'student',
    quote      VARCHAR(500) NOT NULL,
    rating     TINYINT UNSIGNED NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- 13. Call To Action (single row, up to 4 buttons) -----------------------------
CREATE TABLE IF NOT EXISTS cta_content (
    id            TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    title         VARCHAR(200) NOT NULL,
    subtitle      VARCHAR(400) NOT NULL,
    button1_text  VARCHAR(60)  NULL,
    button1_url   VARCHAR(255) NULL,
    button2_text  VARCHAR(60)  NULL,
    button2_url   VARCHAR(255) NULL,
    button3_text  VARCHAR(60)  NULL,
    button3_url   VARCHAR(255) NULL,
    button4_text  VARCHAR(60)  NULL,
    button4_url   VARCHAR(255) NULL,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_cta_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---- Global animation kill-switch (read by includes/theme.php) -------------------
INSERT INTO site_settings (setting_key, setting_value) VALUES ('animations_enabled', '1')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- =============================================================
-- HISTORY & HERITAGE — standalone page at /about/history (not a
-- homepage section, so no homepage_sections registry row). Seeded
-- with the real historical facts supplied by the college; the one
-- gap is imagery nobody has provided yet (Father Mackey's photo, the
-- hero background, "then vs now" photos) — those stay honest
-- placeholders in includes/models/History.php until uploaded.
-- =============================================================

CREATE TABLE IF NOT EXISTS history_content (
    id               TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
    hero_title       VARCHAR(200) NOT NULL,
    hero_subtitle    VARCHAR(300) NOT NULL,
    hero_intro       VARCHAR(500) NOT NULL,
    hero_image_path  VARCHAR(255) NULL,
    hero_image_position ENUM('top','center','bottom') NOT NULL DEFAULT 'top',
    founding_story   TEXT NOT NULL,
    vision_king_text TEXT NOT NULL,
    king_photo_path  VARCHAR(255) NULL,
    mackey_name      VARCHAR(150) NOT NULL,
    mackey_photo_path VARCHAR(255) NULL,
    mackey_bio       TEXT NOT NULL,
    motto            VARCHAR(150) NOT NULL,
    motto_meaning    TEXT NULL,
    emblem_meaning   TEXT NULL,
    values_text      TEXT NULL,
    video_url        VARCHAR(255) NULL,
    brochure_path    VARCHAR(255) NULL,
    then_image_path  VARCHAR(255) NULL,
    now_image_path   VARCHAR(255) NULL,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_history_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Self-migrating: adds the column if this table already existed
-- before hero_image_position was introduced (MariaDB 10.0.2+/MySQL 8+).
ALTER TABLE history_content ADD COLUMN IF NOT EXISTS hero_image_position ENUM('top','center','bottom') NOT NULL DEFAULT 'top' AFTER hero_image_path;
ALTER TABLE history_content ADD COLUMN IF NOT EXISTS king_photo_path VARCHAR(255) NULL AFTER vision_king_text;

INSERT INTO history_content (
    id, hero_title, hero_subtitle, hero_intro, founding_story, vision_king_text,
    mackey_name, mackey_bio, motto, motto_meaning, emblem_meaning, values_text
) VALUES (
    1,
    'History & Heritage',
    'Sherubtse College — The Peak of Learning',
    'Founded in 1968 in the hills of Kanglung, Sherubtse College is the oldest tertiary institution in Bhutan — a living record of the nation''s first steps into modern higher education.',
    'The foundation stone of Sherubtse College was laid in June 1966 by His Majesty the Third Druk Gyalpo, Jigme Dorji Wangchuck, and the institution officially opened its doors in 1968. Its name, "Sherubtse" — meaning "Peak of Learning" — captured the vision behind it: the first modern institution of higher learning in eastern Bhutan, opening a path to education for a region that had never had one.',
    'His Majesty the Third Druk Gyalpo, Jigme Dorji Wangchuck, is remembered as the father of modern Bhutan, and Sherubtse College stands among the clearest expressions of his vision. He saw modern education as essential to the Kingdom''s future, and understood that eastern Bhutan, far from the country''s administrative centers, needed a seat of learning of its own. Sherubtse College was founded to answer that need.',
    'Father William Mackey',
    'Father William Mackey served as the founding principal of Sherubtse College, guiding the institution through its earliest and most formative years. A Canadian Jesuit educator, he played a central role in shaping the college''s academic character and its lasting contribution to Bhutanese education — a legacy the college continues to build on today.',
    'Education for Excellence',
    'The motto reflects Sherubtse College''s founding commitment: that education in eastern Bhutan should not merely exist, but strive for excellence.',
    'The college emblem draws on Bhutanese Buddhist and cultural symbolism to represent the institution''s heritage and its mission of enlightening minds through learning. (Admin: replace this with the emblem''s official description.)',
    'Academic excellence, service to the nation, and the preservation of Bhutanese culture and values alongside modern scholarship.'
) ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS history_timeline_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    year        VARCHAR(20)  NOT NULL,
    event       VARCHAR(200) NOT NULL,
    description VARCHAR(400) NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    UNIQUE KEY uniq_history_timeline_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO history_timeline_items (year, event, sort_order) VALUES
    ('1966',    'Foundation stone laid', 1),
    ('1968',    'Sherubtse Public School inaugurated', 2),
    ('1976',    'Upgraded to Junior College', 3),
    ('1978',    'Arts and Commerce introduced', 4),
    ('1983',    'Affiliated with Delhi University', 5),
    ('2003',    'Became a constituent college of the Royal University of Bhutan', 6),
    ('Present', 'Leading multidisciplinary college', 7)
ON DUPLICATE KEY UPDATE event = VALUES(event);

CREATE TABLE IF NOT EXISTS history_legacy_items (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    icon       VARCHAR(60)  NOT NULL,
    text       VARCHAR(300) NOT NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    UNIQUE KEY uniq_history_legacy_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO history_legacy_items (icon, text, sort_order) VALUES
    ('bi-patch-check-fill', 'The first accredited college in Bhutan', 1),
    ('bi-bank',             'A constituent college of the Royal University of Bhutan since 2003', 2),
    ('bi-mortarboard-fill', 'Thousands of graduates serving Bhutan across every sector', 3),
    ('bi-globe-asia-australia', 'Lasting contributions in education, government, science and public service', 4)
ON DUPLICATE KEY UPDATE text = VALUES(text);

CREATE TABLE IF NOT EXISTS history_tradition_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    icon        VARCHAR(60)  NOT NULL,
    title       VARCHAR(150) NOT NULL,
    description VARCHAR(300) NULL,
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    UNIQUE KEY uniq_history_tradition_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO history_tradition_items (icon, title, sort_order) VALUES
    ('bi-brightness-high', 'Annual Rimdro & Religious Ceremonies', 1),
    ('bi-stars',           'College Week Celebrations', 2),
    ('bi-book',            'Literary & Cultural Festivals', 3),
    ('bi-trophy',          'Sports & Student Clubs', 4),
    ('bi-hand-thumbs-up',  'Community Service Activities', 5)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- No seed rows: with no real archival photography yet, an empty table
-- means the Heritage Gallery section simply doesn't render (see
-- includes/models/History.php), same rule as gallery_images.
CREATE TABLE IF NOT EXISTS history_gallery_images (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path  VARCHAR(255) NOT NULL,
    caption     VARCHAR(200) NULL,
    category    ENUM('campus','students','construction','events','festivals','graduation') NOT NULL DEFAULT 'campus',
    sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
