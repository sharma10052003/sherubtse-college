/**
 * Reads the plain Markdown an editor writes in a facility's "Content" and "Uses" fields
 * (Strapi → Campus Facilities) and turns it into blocks the facility page can lay out:
 *   - a bold label that opens a paragraph ("**Vision.** To promote…")  → a labelled card
 *   - a bold line on its own ("**Services offered**") + a list          → a titled list
 *   - a list whose lines carry e-mail addresses                         → contact cards
 * Everything is escaped first; only **bold** and [links](https://…) are turned back into
 * HTML, so nothing an editor types can inject markup.
 */

export type Block =
  | { type: 'p'; html: string }
  | { type: 'labelled'; label: string; html: string }
  | { type: 'section'; title: string; items: string[]; html: string[] };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown (bold and links) to safe HTML. */
export function inline(text: string): string {
  return esc(text)
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:|\/)[^)\s]*)\)/g, (_m, label, url) => {
      const external = /^https?:/.test(url);
      return `<a href="${url}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export const plain = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');

export function parseBlocks(md: string | null | undefined): Block[] {
  const blocks: Block[] = [];
  const paragraphs = (md ?? '').replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  let open: Extract<Block, { type: 'section' }> | null = null;

  for (const para of paragraphs) {
    const lines = para.split('\n').map((l) => l.trim());
    const bullets = lines.every((l) => /^[-•]\s+/.test(l));
    if (bullets) {
      const items = lines.map((l) => l.replace(/^[-•]\s+/, ''));
      if (open) {
        open.items.push(...items.map(plain));
        open.html.push(...items.map(inline));
        open = null;
      } else {
        blocks.push({ type: 'section', title: '', items: items.map(plain), html: items.map(inline) });
      }
      continue;
    }
    const heading = para.match(/^\*\*([^*]+)\*\*$/);
    if (heading) {
      open = { type: 'section', title: heading[1].trim().replace(/[.:]$/, ''), items: [], html: [] };
      blocks.push(open);
      continue;
    }
    open = null;
    const labelled = para.match(/^\*\*([^*]{2,40}?)[.:]\*\*\s+([\s\S]+)$/);
    if (labelled) blocks.push({ type: 'labelled', label: labelled[1].trim(), html: inline(labelled[2].replace(/\n/g, ' ')) });
    else blocks.push({ type: 'p', html: inline(para.replace(/\n/g, ' ')) });
  }
  return blocks.filter((b) => b.type !== 'section' || b.items.length > 0);
}

export interface ContactCard {
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
}

/** "Name, Role — email, phone" lines → contact cards (a line without an e-mail is left out). */
export function parseContacts(items: string[]): ContactCard[] {
  const cards: ContactCard[] = [];
  for (const raw of items) {
    const email = raw.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)?.[0] ?? null;
    if (!email) continue;
    const phone = raw.match(/(?:\+?\d[\d\s-]{6,}\d)/)?.[0]?.trim() ?? null;
    const head = raw.split(/\s+[—–]\s+/)[0] ?? raw;
    const [name, ...rest] = head.split(',');
    cards.push({ name: name.trim(), role: rest.join(',').trim() || null, email, phone });
  }
  return cards;
}

/** A Bhutan number as people write it ("17731385", "975-04-535171") → a tel: link. */
export function telHref(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('975')) return `tel:+${d}`;
  if (d.length === 8) return `tel:+975${d}`;
  return `tel:${d}`;
}
