import { fetchAPI } from "../api";
import { list, toParagraphs } from "./helpers";

// ── News ──────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: number | string;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  image?: string;
  pdf?: string;
  link?: string;
  body?: string[];
}

interface ApiNewsItem {
  id: number;
  title: string;
  slug: string;
  author?: string;
  date: string;
  raw_date?: string;
  brief?: string;
  content?: string;
  image?: string | null;
  pdf_url?: string | null;
  meta_keywords?: string;
  meta_description?: string;
  schema_code?: string;
}

export async function getNews(): Promise<NewsItem[]> {
  const rows = list<ApiNewsItem>(await fetchAPI<unknown>("news")).filter(
    (n) => n.slug && n.title
  );
  return rows.map((n) => {
    const body = toParagraphs(n.content ?? "");
    return {
      id: n.id,
      slug: n.slug,
      date: n.date,
      title: n.title,
      excerpt: n.brief?.trim() || body[0] || "",
      ...(n.image && { image: n.image }),
      ...(n.pdf_url && { pdf: n.pdf_url }),
      ...(body.length > 0 && { body }),
    };
  });
}

// ── Notices & Events ──────────────────────────────────────────────────────────

export interface Notice {
  id: number | string;
  type?: number | string;
  date: string;
  title: string;
  tag?: string;
  text: string;
  download?: string;
}

export interface EventItem {
  id: number | string;
  type?: number | string;
  date: string;
  title: string;
  tag?: string;
  text: string;
  download?: string;
}

interface ApiNoticeItem {
  id: number | string;
  type?: number | string;
  title: string;
  tag?: string;
  date: string;
  download?: string | null;
  content?: string;
}

/** Type "1" from /notice API */
export async function getNotices(): Promise<Notice[]> {
  const rows = list<ApiNoticeItem>(await fetchAPI<unknown>("notice")).filter(
    (n) => n.title && (n.type === undefined || n.type === null || String(n.type) === "1")
  );
  return rows.map((n) => ({
    id: n.id,
    type: n.type,
    date: n.date,
    title: n.title,
    ...(n.tag && { tag: n.tag }),
    text: toParagraphs(n.content ?? "").join(" "),
    ...(n.download && { download: n.download }),
  }));
}

/** Type "2" from /notice API */
export async function getEvents(): Promise<EventItem[]> {
  const rows = list<ApiNoticeItem>(await fetchAPI<unknown>("notice")).filter(
    (n) => n.title && String(n.type) === "2"
  );
  return rows.map((n) => ({
    id: n.id,
    type: n.type,
    date: n.date,
    title: n.title,
    ...(n.tag && { tag: n.tag }),
    text: toParagraphs(n.content ?? "").join(" "),
    ...(n.download && { download: n.download }),
  }));
}
