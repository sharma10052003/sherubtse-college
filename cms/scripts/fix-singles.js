#!/usr/bin/env node
/**
 * One-off follow-up to migrate.js: the first migrate.js run used the
 * wrong REST path for Strapi's 6 Single Types (plural instead of
 * singular — Strapi Single Type routes are always /api/{singularName},
 * never pluralized) and all 6 PUTs failed with 405. Media and every
 * collection type from that run succeeded, so this script reuses the
 * already-uploaded media (fetched from /api/upload/files) instead of
 * re-uploading, and only (re)creates the 6 Single Types.
 *
 * Usage: STRAPI_MIGRATION_TOKEN=... node scripts/fix-singles.js
 */
const seed = require('./seed-data');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_MIGRATION_TOKEN;
if (!TOKEN) {
  console.error('STRAPI_MIGRATION_TOKEN is not set.');
  process.exit(1);
}

function fixMangledPath(url) {
  if (typeof url !== 'string') return url;
  const m = url.match(/^C:\/Program Files\/Git(\/.*)$/);
  return m ? m[1] : url;
}

async function api(method, endpoint, body) {
  const url = `${STRAPI_URL}/api/${endpoint.replace(/^\//, '')}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify({ data: body }) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${endpoint} -> ${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function fetchMediaMaps() {
  const res = await fetch(`${STRAPI_URL}/api/upload/files?pagination[pageSize]=100`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const files = await res.json();
  const maps = { hero: {}, gallery: {}, history: {}, president: {} };
  for (const f of files) {
    if (f.name.startsWith('hero_')) maps.hero[f.name] = f.id;
    else if (f.name.startsWith('gal_')) maps.gallery[f.name] = f.id;
    else if (f.name.startsWith('hist_')) maps.history[f.name] = f.id;
    else if (f.name.startsWith('pres_')) maps.president[f.name] = f.id;
  }
  return maps;
}

async function main() {
  const { hero: heroMedia, history: historyMedia, president: presidentMedia } = await fetchMediaMaps();
  console.log('Reused media maps:', { heroMedia, historyMedia, presidentMedia });

  await api('PUT', 'hero-content', {
    ...seed.heroContent,
    cta1_url: fixMangledPath(seed.heroContent.cta1_url),
    cta2_url: fixMangledPath(seed.heroContent.cta2_url),
    media: heroMedia[seed.heroContent.media_path] ?? null,
    media_path: undefined,
  });
  console.log('hero-content: OK');

  await api('PUT', 'gallery-content', seed.galleryContent);
  console.log('gallery-content: OK');

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
  console.log('president-content: OK');

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
  console.log('history-content: OK');

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
    await api('PUT', 'header-setting?locale=dz', {
      college_name: hs.college_name_dz || hs.college_name,
      motto: hs.motto_dz || hs.motto,
    });
  }
  console.log('header-setting: OK');

  await api('PUT', 'theme-setting', seed.themeSettings);
  console.log('theme-setting: OK');

  console.log('\nAll 6 single types created successfully.');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
