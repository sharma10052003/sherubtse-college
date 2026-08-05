#!/usr/bin/env node
/**
 * One-time data + media migration from the old PHP/MySQL site into Strapi.
 *
 * Run once against a fresh Strapi database. Not idempotent — re-running
 * will create duplicate collection-type entries (Single Types are safe
 * to re-run, since PUT on a Single Type creates-or-updates). If you need
 * a clean re-run, stop Strapi, delete college_website/.tmp/data.db, and
 * restart before running this again.
 *
 * Usage:
 *   node scripts/migrate.js --dry-run     # log every payload, write nothing
 *   node scripts/migrate.js               # perform the migration for real
 *
 * Required environment variables:
 *   STRAPI_URL              default http://localhost:1337
 *   STRAPI_MIGRATION_TOKEN  a Strapi API Token with "Full access", created
 *                           in Strapi admin -> Settings -> API Tokens.
 *                           Delete this token once the migration is done.
 *
 * Optional:
 *   SOURCE_UPLOADS_DIR      default C:\xampp\htdocs\sherubtse-college\assets\uploads
 */

const fs = require('fs');
const path = require('path');
const seed = require('./seed-data');

const DRY_RUN = process.argv.includes('--dry-run');
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_MIGRATION_TOKEN;
const UPLOADS_DIR = process.env.SOURCE_UPLOADS_DIR
  || 'C:\\xampp\\htdocs\\sherubtse-college\\assets\\uploads';

if (!DRY_RUN && !TOKEN) {
  console.error('STRAPI_MIGRATION_TOKEN is not set. Create a "Full access" API token in');
  console.error('Strapi admin (Settings -> API Tokens) and re-run with it set, or pass --dry-run.');
  process.exit(1);
}

const summary = []; // { type, created, skipped, failed }
function record(type, created, skipped, failed) {
  summary.push({ type, created, skipped, failed });
}

const MIME_BY_EXT = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
};

/** Fixes a Git-Bash MSYS path-mangling artifact found in the source hero_content export
 *  (e.g. "C:/Program Files/Git/admissions/apply" -> "/admissions/apply"). */
function fixMangledPath(url) {
  if (typeof url !== 'string') return url;
  const m = url.match(/^C:\/Program Files\/Git(\/.*)$/);
  return m ? m[1] : url;
}

async function api(method, endpoint, body) {
  const url = `${STRAPI_URL}/api/${endpoint.replace(/^\//, '')}`;
  if (DRY_RUN) {
    console.log(`[dry-run] ${method} ${url}\n  ${JSON.stringify(body)}`);
    return { data: { id: 'DRYRUN', documentId: 'DRYRUN' } };
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: body ? JSON.stringify({ data: body }) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${endpoint} -> ${res.status} ${JSON.stringify(json)}`);
  }
  return json;
}

async function uploadFile(filePath) {
  const filename = path.basename(filePath);
  if (DRY_RUN) {
    console.log(`[dry-run] upload ${filename}`);
    return { id: 'DRYRUN', url: `/uploads/${filename}` };
  }
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const form = new FormData();
  form.append('files', new Blob([buf], { type: MIME_BY_EXT[ext] || 'application/octet-stream' }), filename);
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`upload ${filename} -> ${res.status} ${JSON.stringify(json)}`);
  }
  return Array.isArray(json) ? json[0] : json;
}

/** Uploads every file in dirPath (skips dotfiles) and returns a filename -> media id map. */
async function uploadFolder(dirPath) {
  const map = {};
  if (!fs.existsSync(dirPath)) {
    console.warn(`[warn] upload folder not found, skipping: ${dirPath}`);
    return map;
  }
  const files = fs.readdirSync(dirPath).filter((f) => !f.startsWith('.'));
  let ok = 0;
  let failed = 0;
  for (const f of files) {
    try {
      const uploaded = await uploadFile(path.join(dirPath, f));
      map[f] = uploaded.id;
      ok++;
    } catch (e) {
      console.error(`[error] uploading ${f}: ${e.message}`);
      failed++;
    }
  }
  record(`media:${path.basename(dirPath)}`, ok, 0, failed);
  return map;
}

/** Creates the dz-locale version of an already-created document, sending only localized fields. */
async function localize(pluralApi, documentId, localizedData) {
  if (documentId === 'DRYRUN') {
    console.log(`[dry-run] PUT ${pluralApi}/${documentId}?locale=dz`, localizedData);
    return;
  }
  try {
    const url = `${STRAPI_URL}/api/${pluralApi}/${documentId}?locale=dz`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ data: localizedData }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.warn(`[warn] dz localization failed for ${pluralApi}/${documentId}: ${res.status} ${JSON.stringify(json)}`);
    }
  } catch (e) {
    console.warn(`[warn] dz localization error for ${pluralApi}/${documentId}: ${e.message}`);
  }
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (no writes) ===' : '=== MIGRATING ===');

  // ---- 1. Media uploads ----
  console.log('\n-- Uploading media --');
  const heroMedia = await uploadFolder(path.join(UPLOADS_DIR, 'hero'));
  const galleryMedia = await uploadFolder(path.join(UPLOADS_DIR, 'gallery'));
  const historyMedia = await uploadFolder(path.join(UPLOADS_DIR, 'history'));
  const presidentMedia = await uploadFolder(path.join(UPLOADS_DIR, 'president'));
  if (Object.keys(galleryMedia).length) {
    console.log(`[note] ${Object.keys(galleryMedia).length} gallery file(s) uploaded to the Media`
      + ' Library only — no gallery-image entries were created (source table had 0 rows).'
      + ' Curate real entries from these uploads in Strapi admin.');
  }

  // ---- 2. Single types with real source data ----
  console.log('\n-- Single types --');

  try {
    const res = await api('PUT', 'hero-content', {
      ...seed.heroContent,
      cta1_url: fixMangledPath(seed.heroContent.cta1_url),
      cta2_url: fixMangledPath(seed.heroContent.cta2_url),
      media: heroMedia[seed.heroContent.media_path] ?? null,
      media_path: undefined,
    });
    record('hero-content', 1, 0, 0);
    console.log('hero-content: 1/1');
  } catch (e) {
    record('hero-content', 0, 0, 1);
    console.error(`[error] hero-content: ${e.message}`);
  }

  try {
    await api('PUT', 'gallery-content', seed.galleryContent);
    record('gallery-content', 1, 0, 0);
    console.log('gallery-content: 1/1');
  } catch (e) {
    record('gallery-content', 0, 0, 1);
    console.error(`[error] gallery-content: ${e.message}`);
  }

  try {
    const p = seed.presidentContent;
    await api('PUT', 'president-content', {
      name: p.name,
      position: p.position,
      message: p.message,
      photo: presidentMedia[p.photo_path] ?? null,
      signature: p.signature_path ? presidentMedia[p.signature_path] ?? null : null,
      button_text: p.button_text,
      button_url: p.button_url,
    });
    record('president-content', 1, 0, 0);
    console.log('president-content: 1/1');
  } catch (e) {
    record('president-content', 0, 0, 1);
    console.error(`[error] president-content: ${e.message}`);
  }

  try {
    const h = seed.historyContent;
    await api('PUT', 'history-content', {
      hero_title: h.hero_title,
      hero_subtitle: h.hero_subtitle,
      hero_intro: h.hero_intro,
      hero_image: historyMedia[h.hero_image_path] ?? null,
      hero_image_position: h.hero_image_position,
      founding_story: h.founding_story,
      vision_king_text: h.vision_king_text,
      king_photo: historyMedia[h.king_photo_path] ?? null,
      mackey_name: h.mackey_name,
      mackey_photo: historyMedia[h.mackey_photo_path] ?? null,
      mackey_bio: h.mackey_bio,
      motto: h.motto,
      motto_meaning: h.motto_meaning,
      emblem_meaning: h.emblem_meaning,
      values_text: h.values_text,
      video_url: h.video_url,
      brochure: h.brochure_path ? historyMedia[h.brochure_path] ?? null : null,
      then_image: historyMedia[h.then_image_path] ?? null,
      now_image: historyMedia[h.now_image_path] ?? null,
    });
    record('history-content', 1, 0, 0);
    console.log('history-content: 1/1');
  } catch (e) {
    record('history-content', 0, 0, 1);
    console.error(`[error] history-content: ${e.message}`);
  }

  try {
    const hs = seed.headerSettings;
    await api('PUT', 'header-setting', {
      college_name: hs.college_name,
      motto: hs.motto,
      contact_email: hs.contact_email,
      contact_phone: hs.contact_phone,
      office_hours: hs.office_hours,
      address: hs.address,
    });
    if (hs.college_name_dz || hs.motto_dz) {
      // Single types have no /documentId segment in their URL — locale is a query param on the same path.
      await api('PUT', 'header-setting?locale=dz', {
        college_name: hs.college_name_dz || hs.college_name,
        motto: hs.motto_dz || hs.motto,
      });
    }
    record('header-settings', 1, 0, 0);
    console.log('header-settings: 1/1');
  } catch (e) {
    record('header-settings', 0, 0, 1);
    console.error(`[error] header-settings: ${e.message}`);
  }

  try {
    await api('PUT', 'theme-setting', seed.themeSettings);
    record('theme-settings', 1, 0, 0);
    console.log('theme-settings: 1/1');
  } catch (e) {
    record('theme-settings', 0, 0, 1);
    console.error(`[error] theme-settings: ${e.message}`);
  }

  // The 9 shape-identical {title, subtitle} singletons and vision-mission-content
  // and cta-content have no source rows — intentionally left unseeded.

  // ---- 3. Collection types: menu-items (parents first, then children) ----
  console.log('\n-- menu-items --');
  const menuIdMap = {}; // sourceId -> documentId
  let menuOk = 0;
  let menuFailed = 0;
  const parents = seed.menuItems.filter((m) => m.parentSourceId === null);
  const children = seed.menuItems.filter((m) => m.parentSourceId !== null);

  for (const m of parents) {
    try {
      const created = await api('POST', 'menu-items', {
        title: m.title, url: m.url, menu_order: m.menu_order,
      });
      menuIdMap[m.sourceId] = created.data.documentId;
      if (m.title_dz) {
        await localize('menu-items', created.data.documentId, { title: m.title_dz });
      }
      menuOk++;
    } catch (e) {
      console.error(`[error] menu-item ${m.title}: ${e.message}`);
      menuFailed++;
    }
  }
  for (const m of children) {
    try {
      const created = await api('POST', 'menu-items', {
        title: m.title, url: m.url, menu_order: m.menu_order,
        parent: menuIdMap[m.parentSourceId] ?? null,
      });
      menuIdMap[m.sourceId] = created.data.documentId;
      if (m.title_dz) {
        await localize('menu-items', created.data.documentId, { title: m.title_dz });
      }
      menuOk++;
    } catch (e) {
      console.error(`[error] menu-item ${m.title}: ${e.message}`);
      menuFailed++;
    }
  }
  record('menu-items', menuOk, 0, menuFailed);
  console.log(`menu-items: ${menuOk}/${seed.menuItems.length}`);

  // ---- 4. Remaining populated collection types ----
  console.log('\n-- Other collection types --');

  async function seedCollection(label, pluralApi, rows, mapRow, localizedFields) {
    let ok = 0;
    let failed = 0;
    for (const row of rows) {
      try {
        const payload = mapRow(row);
        const created = await api('POST', pluralApi, payload);
        if (localizedFields) {
          const loc = {};
          let hasAny = false;
          for (const [field, srcKey] of Object.entries(localizedFields)) {
            if (row[srcKey]) { loc[field] = row[srcKey]; hasAny = true; }
          }
          if (hasAny) await localize(pluralApi, created.data.documentId, loc);
        }
        ok++;
      } catch (e) {
        console.error(`[error] ${label}: ${e.message}`);
        failed++;
      }
    }
    record(label, ok, 0, failed);
    console.log(`${label}: ${ok}/${rows.length}`);
  }

  await seedCollection('hero-items', 'hero-items', seed.heroItems, (r) => ({
    item_type: r.item_type, icon: r.icon, value: r.value, suffix: r.suffix,
    label: r.label, sort_order: r.sort_order,
  }));

  await seedCollection('announcements', 'announcements', seed.announcements, (r) => ({
    title: r.title, content: r.content, announcement_type: r.announcement_type,
    priority: r.priority, is_scrolling: r.is_scrolling, is_active: r.is_active,
    start_date: r.start_date, end_date: r.end_date,
  }), { title: 'title_dz' });

  await seedCollection('history-legacy-items', 'history-legacy-items', seed.historyLegacyItems, (r) => r);

  await seedCollection('history-timeline-items', 'history-timeline-items', seed.historyTimelineItems, (r) => r);

  await seedCollection('history-tradition-items', 'history-tradition-items', seed.historyTraditionItems, (r) => r);

  await seedCollection('homepage-sections', 'homepage-sections', seed.homepageSections, (r) => r);

  await seedCollection('social-links', 'social-links', seed.socialLinks, (r) => r);

  await seedCollection('utility-links', 'utility-links', seed.utilityLinks, (r) => ({
    title: r.title, url: r.url, icon: r.icon, is_active: r.is_active,
    display_order: r.display_order, is_external: r.is_external,
  }), { title: 'title_dz' });

  await seedCollection('ui-strings', 'ui-strings', seed.uiStrings, (r) => ({
    key: r.key, value: r.value, group_name: r.group_name,
  }), { value: 'value_dz' });

  // ---- Summary ----
  console.log('\n=== Summary ===');
  for (const s of summary) {
    console.log(`  ${s.type}: created ${s.created}, failed ${s.failed}`);
  }
  const anyFailed = summary.some((s) => s.failed > 0);
  if (anyFailed) {
    console.log('\nSome rows failed — review the [error] lines above.');
    process.exitCode = 1;
  } else {
    console.log('\nAll rows migrated successfully.');
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
