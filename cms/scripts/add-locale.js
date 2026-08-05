#!/usr/bin/env node
/**
 * One-off: adds the Dzongkha (dz) locale to Strapi's i18n plugin.
 *
 * Strapi's admin UI "Add new locale" dialog only offers locales from its
 * bundled iso-locales.json preset list (625 entries) for autocomplete —
 * Dzongkha isn't in that list, so it can't be added from the UI. The
 * underlying locale table has no such restriction (just: code must be
 * exactly 2 characters), so this creates it directly via the i18n
 * plugin's locale service.
 *
 * Usage: node scripts/add-locale.js
 * Safe to run once; exits without changes if "dz" already exists.
 */
const { compileStrapi, createStrapi } = require('@strapi/strapi');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    const localesService = app.plugin('i18n').service('locales');
    const existing = await localesService.findByCode('dz');
    if (existing) {
      console.log('Locale "dz" already exists — nothing to do.');
      return;
    }

    const created = await localesService.create({
      code: 'dz',
      name: 'Dzongkha (dz)',
      isDefault: false,
    });
    console.log('Created locale:', created);
  } finally {
    await app.destroy();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Failed to add locale:', e);
    process.exit(1);
  });
