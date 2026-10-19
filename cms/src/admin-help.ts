import type { Core } from '@strapi/strapi';

/**
 * Friendly labels and help text in the admin edit forms. Strapi keeps these
 * in its content-manager view configuration; this only fills a label still
 * equal to the raw field name and a description that is still empty, so
 * anything an admin changes under "Configure the view" is kept. Safe to run
 * on every boot. Shared by the Admission and Campus Facilities pages.
 */

export type HelpMap = Record<string, { mainField?: string; fields: Record<string, string> }>;

const humanize = (field: string) => field.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export async function applyAdminHelp({
  strapi,
  help,
  prefixes,
  storeKey,
  relabel = () => true,
}: {
  strapi: Core.Strapi;
  /** Keys like 'content_types::api::x.x' or 'components::cat.name'. */
  help: HelpMap;
  /** Configurations whose raw field-name labels are humanized. */
  prefixes: string[];
  /** Remembers which types already had their list title field set. */
  storeKey: string;
  relabel?: (key: string) => boolean;
}) {
  const MAIN_FIELD_STORE = { type: 'core', name: 'seeds', key: storeKey } as const;
  const mainFieldDone = ((await strapi.store.get(MAIN_FIELD_STORE)) as string[] | null) ?? [];
  const rows: { key: string }[] = await strapi.db
    .connection('strapi_core_store_settings')
    .select('key')
    .where('key', 'like', 'plugin_content_manager_configuration_%');
  const keys = rows
    .map((r) => r.key.replace('plugin_content_manager_configuration_', ''))
    .filter((k) => prefixes.some((p) => k.startsWith(p)) || k in help);

  for (const key of keys) {
    const store = { type: 'plugin', name: 'content_manager_configuration', key } as const;
    const config: any = await strapi.store.get(store);
    if (!config?.metadatas) continue;
    const entry = help[key];
    let changed = false;
    for (const [field, meta] of Object.entries<any>(config.metadatas)) {
      if (!meta?.edit) continue;
      if (relabel(key) && prefixes.some((p) => key.startsWith(p)) && meta.edit.label === field) {
        meta.edit.label = humanize(field);
        changed = true;
      }
      const description = entry?.fields[field];
      if (description && !meta.edit.description) {
        meta.edit.description = description;
        changed = true;
      }
    }
    // The list/relation-picker title field is set once per type, then left
    // to whatever an admin picks.
    if (entry?.mainField && config.settings && config.metadatas[entry.mainField] && !mainFieldDone.includes(key)) {
      config.settings.mainField = entry.mainField;
      config.settings.defaultSortBy = entry.mainField;
      mainFieldDone.push(key);
      changed = true;
    }
    if (changed) await strapi.store.set({ ...store, value: config });
  }
  await strapi.store.set({ ...MAIN_FIELD_STORE, value: mainFieldDone });
}
