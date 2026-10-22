/**
 * Turns an article body typed in Strapi's rich-text (Markdown) field into
 * safe HTML: everything is escaped first, then only a small set of Markdown
 * is recognised — paragraphs, line breaks, ## headings, - / 1. lists,
 * > quotes, **bold**, *italic* and [links](https://…). Anything else stays
 * as the literal text the editor typed.
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** One line of text with **bold**, *italic* and [links](https://…) only. */
export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^\s)]+)\)/g, (_m, label, url) => {
      const external = /^https?:/i.test(url);
      return `<a href="${url}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
    });
}

export interface ArticleBlocks {
  /** First plain paragraph, as text — used as the lede when there is no summary. */
  firstParagraph: string | null;
  /** HTML for every block. */
  html: string;
  /** HTML for every block after the first plain paragraph. */
  htmlWithoutFirst: string;
  words: number;
}

export function renderArticle(body: string | null | undefined): ArticleBlocks {
  const blocks = (body ?? '')
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  let firstParagraphIndex = -1;
  const rendered = blocks.map((block, i) => {
    const lines = block.split('\n');
    const heading = block.match(/^(#{1,4})\s+(.+)$/);
    if (heading && lines.length === 1) {
      const level = heading[1].length <= 2 ? 2 : 3;
      return `<h${level}>${inline(heading[2])}</h${level}>`;
    }
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    }
    if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
      return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`;
    }
    if (lines.every((l) => /^>\s?/.test(l))) {
      return `<blockquote><p>${lines.map((l) => inline(l.replace(/^>\s?/, ''))).join('<br>')}</p></blockquote>`;
    }
    if (firstParagraphIndex === -1) firstParagraphIndex = i;
    return `<p>${lines.map(inline).join('<br>')}</p>`;
  });

  const plain = (body ?? '').replace(/[#>*_`[\]()-]/g, ' ');
  return {
    firstParagraph: firstParagraphIndex >= 0 ? blocks[firstParagraphIndex].replace(/\s*\n\s*/g, ' ') : null,
    html: rendered.join('\n'),
    htmlWithoutFirst: rendered.filter((_, i) => i !== firstParagraphIndex).join('\n'),
    words: plain.split(/\s+/).filter(Boolean).length,
  };
}

/** Plain-text excerpt of a body or summary for cards. */
export function excerpt(text: string | null | undefined, n = 150): string {
  const t = (text ?? '').replace(/[#>*_`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t;
}
