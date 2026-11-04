// ── HTML & String helpers ─────────────────────────────────────────────────────

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", hellip: "…", middot: "·",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** HTML fragment -> plain text on one line. */
export const toText = (html: string) => decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();

/** HTML fragment -> one plain-text string per paragraph / line break (lists excluded). */
export const toParagraphs = (html: string) =>
  html
    .replace(/<(ul|ol)[\s\S]*?<\/\1>/gi, "")
    .split(/<\/p>|<br\s*\/?>/i)
    .map(toText)
    .filter(Boolean);

export const toListItems = (html: string) =>
  [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => toText(m[1])).filter(Boolean);

/** The CMS stores internal links as "//path" (and "//" for home). Make them real site paths. */
export const toPath = (link: string) => (/^https?:\/\//i.test(link) ? link : "/" + link.replace(/^\/+/, ""));

export const list = <T>(data: unknown): T[] => (Array.isArray(data) ? (data as T[]) : []);
