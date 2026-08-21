/**
 * requireAltText — shared validation used by lifecycle hooks across content
 * types with image media fields (Build Brief section 03: "Required on every
 * media upload. Publication blocked without it."). Strapi has no native
 * per-field alt-text validation, so this is enforced here instead.
 *
 * Scoped to direct image-type media fields on an entry (unit.photo,
 * person.photo, news.images, etc.) — media nested inside repeatable
 * components (e.g. notice.attachments, recruitment.stage_documents) isn't
 * checked by this pass, since those are downloadable files rather than
 * images alt text is meant for.
 */

type MediaRelationInput =
  | number
  | { id: number }
  | Array<number | { id: number }>
  | { connect?: Array<number | { id: number }>; set?: Array<number | { id: number }> }
  | null
  | undefined;

function extractMediaIds(value: MediaRelationInput): number[] {
  if (value == null) return [];
  if (typeof value === 'number') return [value];
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'number' ? item : item.id));
  }
  if (typeof value === 'object') {
    const ids: number[] = [];
    for (const key of ['connect', 'set'] as const) {
      const arr = (value as { connect?: Array<number | { id: number }>; set?: Array<number | { id: number }> })[key];
      if (Array.isArray(arr)) {
        for (const item of arr) {
          ids.push(typeof item === 'number' ? item : item.id);
        }
      }
    }
    return ids;
  }
  return [];
}

export async function requireAltText(data: Record<string, unknown>, mediaFields: string[]): Promise<void> {
  for (const field of mediaFields) {
    const ids = extractMediaIds(data[field] as MediaRelationInput);
    if (!ids.length) continue;

    const files = await strapi.db.query('plugin::upload.file').findMany({
      where: { id: { $in: ids } },
    });
    const missing = files.filter((f: { alternativeText?: string | null }) => !f.alternativeText?.trim());

    if (missing.length) {
      throw new Error(
        `Alt text is required on every image before it can be saved — missing on ${missing.length} image(s) for field "${field}".`
      );
    }
  }
}
