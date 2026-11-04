import { Metadata } from "next";
import { fetchAPI } from "./api";
import { PageMetaKey } from "./types/metadata";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

// ─────────────────────────────────────────────────────────────────────────────
// API sources
//
// All SEO data comes from two endpoints:
//   `siteregulars` — global defaults: site title/name, social images, favicon,
//                    tracking scripts (GA4, GTM, Clarity, FB Pixel)
//   `schema`       — per-page entries keyed by slug: meta title/keywords/
//                    description, OG image, JSON-LD schema_code, faq_schema
// ─────────────────────────────────────────────────────────────────────────────

/** Raw shape of the `siteregulars` API endpoint. */
interface SiteRegulars {
  sitetitle?: string;
  sitename?: string;
  fav_icon?: string;
  logo_upload?: string;
  fb_img?: string;
  x_img?: string;
  meta_title?: string;
  site_keywords?: string;
  site_description?: string;
  /** Google Analytics measurement ID, e.g. "G-XXXXXXXXXX" */
  google_analytics_code?: string;
  /** Google Tag Manager ID, e.g. "GTM-XXXXXXX" */
  gtm_code?: string;
  /** Microsoft Clarity project ID, e.g. "x5qzz1n4sh" */
  clarity_code?: string;
  fb_pixel_code?: string;
  schema_code?: string;
  headers?: string;
  google_site_verification?: string;
}

/** One entry of the `schema` API endpoint — per-page SEO + JSON-LD. */
interface CmsSchemaEntry {
  id?: string;
  title?: string;
  slug?: string;
  schema_code?: string | Record<string, unknown>;
  faq_schema?: { q?: string; a?: string }[];
  image?: string;
  fb_upload?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

async function getSiteRegulars(): Promise<SiteRegulars> {
  try {
    return (await fetchAPI<SiteRegulars>("siteregulars")) ?? {};
  } catch {
    return {};
  }
}

async function getSchemaEntries(): Promise<CmsSchemaEntry[]> {
  try {
    const data = await fetchAPI<CmsSchemaEntry[]>("schema");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** First non-empty trimmed string — the CMS returns "" for unset fields. */
function firstText(...vals: (string | undefined)[]): string | undefined {
  for (const v of vals) {
    const t = v?.trim();
    if (t) return t;
  }
  return undefined;
}

/**
 * Extracts verification token from a raw string or an HTML <meta> tag.
 * Handles both plain tokens ("xyz123") and HTML tags ('<meta name="google-site-verification" content="xyz123" />').
 */
function extractMetaContent(raw?: string, nameAttr = "google-site-verification"): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const metaMatch =
    trimmed.match(new RegExp(`<meta[^>]*name=["']${nameAttr}["'][^>]*content=["']([^"']+)["']`, "i")) ||
    trimmed.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${nameAttr}["']`, "i"));
  if (metaMatch) {
    return metaMatch[1];
  }

  if (!/<[^>]+>/.test(trimmed)) {
    return trimmed;
  }

  return undefined;
}

/** Strip leading slash: "/gallery" → "gallery", "/" → "" */
function normaliseSlug(s: string): string {
  return s.replace(/^\//, "");
}

/**
 * Builds a complete Next.js `Metadata` object for any page.
 *
 * Per-page values come from the `schema` API entry whose `slug` matches
 * `pageKey`; anything missing falls back to the `siteregulars` globals.
 *
 * @param pageKey  - CMS schema slug: "home" | "facilities" | "gallery"
 *                   | "blog" | "notice" | "contact". Unknown keys simply
 *                   fall back to the global defaults.
 * @param overrides - Partial<Metadata> merged on top (page-level values win)
 * @param pathSegment - URL path, e.g. "/about-us". Used to generate the canonical URL.
 *
 * @example — static page
 *   export async function generateMetadata(): Promise<Metadata> {
 *     return buildMetadata("gallery", {}, "/gallery");
 *   }
 *
 * @example — dynamic page with page-specific title override
 *   return buildMetadata("blog", { title: post.title }, `/blog/${slug}`);
 */
export async function buildMetadata(
  pageKey: PageMetaKey | string,
  overrides: Partial<Metadata> = {},
  pathSegment: string = ""
): Promise<Metadata> {
  const [regulars, entries] = await Promise.all([getSiteRegulars(), getSchemaEntries()]);

  const slug = normaliseSlug(pageKey);
  const entry = entries.find((e) => e.slug && normaliseSlug(e.slug) === slug);

  const title =
    firstText(entry?.meta_title, regulars.meta_title, regulars.sitetitle) ??
    "Apex Life School | Schooling For Life — Chabahil, Kathmandu";

  const description =
    firstText(entry?.meta_description, regulars.site_description) ??
    "Apex Life School in Chabahil, Kathmandu — over four decades of schooling for life.";

  const keywords =
    firstText(entry?.meta_keywords, regulars.site_keywords) ??
    "Apex Life School, Chabahil, Kathmandu, school admission 2083, Schooling For Life";

  const ogImage = firstText(entry?.fb_upload, entry?.image, regulars.fb_img, regulars.x_img) ?? "";
  const twitterImage = firstText(regulars.x_img, ogImage);

  const faviconUrl = firstText(regulars.fav_icon, regulars.logo_upload) ?? "/icon.png";

  // Canonical URL — always generated by us (CMS value is intentionally empty)
  const canonical = pathSegment ? `${SITE_URL}${pathSegment}` : undefined;

  // Extract site verification tokens from CMS parameters / headers or env var
  const googleVerification =
    extractMetaContent(regulars.google_site_verification, "google-site-verification") ??
    extractMetaContent(regulars.headers, "google-site-verification") ??
    extractMetaContent(regulars.schema_code, "google-site-verification") ??
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  const fbVerification =
    extractMetaContent(regulars.headers, "facebook-domain-verification") ??
    extractMetaContent(regulars.schema_code, "facebook-domain-verification");

  const bingVerification =
    extractMetaContent(regulars.headers, "msvalidate.01") ??
    extractMetaContent(regulars.schema_code, "msvalidate.01");

  const otherVerification: Record<string, string> = {};
  if (bingVerification) otherVerification["msvalidate.01"] = bingVerification;
  if (fbVerification) otherVerification["facebook-domain-verification"] = fbVerification;

  const verification: Metadata["verification"] = {
    ...(googleVerification && { google: googleVerification }),
    ...(Object.keys(otherVerification).length > 0 && { other: otherVerification }),
  };

  const base: Metadata = {
    metadataBase: new URL(SITE_URL || "https://apexlifeschool.edu.np"),
    title,
    description,
    keywords,
    ...(googleVerification || Object.keys(otherVerification).length > 0 ? { verification } : {}),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    ...(canonical && { alternates: { canonical } }),
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      ...(canonical && { url: canonical }),
      siteName: firstText(regulars.sitename) ?? "Apex Life School",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterImage && { images: [twitterImage] }),
    },
  };

  // Deep-merge overrides: openGraph fields require special handling
  const { openGraph: ogOverride, twitter: twOverride, ...restOverrides } = overrides;

  return {
    ...base,
    ...restOverrides,
    openGraph: {
      ...base.openGraph,
      ...(ogOverride ?? {}),
    },
    twitter: {
      ...base.twitter,
      ...(twOverride ?? {}),
    },
  };
}

/**
 * Returns the validated tracking IDs from the `siteregulars` API,
 * or null per ID when the stored value is not a real ID.
 */
export async function getAnalyticsIds(): Promise<{
  gaId: string | null;
  gtmId: string | null;
  clarityId: string | null;
  fbPixelId: string | null;
  schemaCode: string | null;
}> {
  const regulars = await getSiteRegulars();

  // GA4: "G-XXXXXXXXXX", UA: "UA-XXXXXXXX-X" — CMS values may have stray spaces
  const gaRaw = (regulars.google_analytics_code ?? "").trim();
  const gaId = /^(G-|UA-)\w+/.test(gaRaw) ? gaRaw : null;

  // GTM: "GTM-XXXXXXX"
  const gtmRaw = regulars.gtm_code ?? "";
  const gtmId = /^GTM-\w+/.test(gtmRaw.trim()) ? gtmRaw.trim() : null;

  // Clarity: alphanumeric project ID, e.g. "x5qzz1n4sh"
  const clarityRaw = regulars.clarity_code ?? "";
  const clarityId = /^[a-z0-9]+$/i.test(clarityRaw.trim()) ? clarityRaw.trim() : null;

  // FB Pixel IDs are numeric strings (typically 15–16 digits)
  const fbRaw = regulars.fb_pixel_code ?? "";
  const fbPixelId = /^\d{10,20}$/.test(fbRaw.trim()) ? fbRaw.trim() : null;

  const schemaCode = firstText(regulars.schema_code) ?? null;

  return { gaId, gtmId, clarityId, fbPixelId, schemaCode };
}

/**
 * Builds an EducationalOrganization + WebSite JSON-LD schema
 * from the `siteregulars` globals. Used in the root layout.
 */
export async function buildOrganizationSchema(): Promise<Record<string, unknown>[]> {
  const regulars = await getSiteRegulars();
  const siteName = firstText(regulars.sitename, regulars.sitetitle) ?? "Apex Life School";
  const ogImage = firstText(regulars.fb_img, regulars.x_img);

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteName,
    alternateName: "Apex Life School, Chabahil",
    url: SITE_URL || "https://apexlifeschool.edu.np",
    description:
      firstText(regulars.site_description) ??
      "Apex Life School in Chabahil, Kathmandu — over four decades of schooling for life.",
    foundingDate: "1983",
    address: {
      "@type": "PostalAddress",
      streetAddress: "KMC-06, Saraswotinagar, Chabahil",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati Province",
      addressCountry: "NP",
    },
    ...(ogImage && { image: ogImage }),
    sameAs: [
      // Add official social profile URLs here when available
    ],
  };

  const webSite: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL || "https://apexlifeschool.edu.np",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL || "https://apexlifeschool.edu.np"}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return [organization, webSite];
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS Schema API integration (JSON-LD)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * schema_code arrives as a full <script type="application/ld+json">…</script>
 * HTML string. This extracts the JSON inside, fixes trailing commas that
 * the CMS editor sometimes produces, and returns a parsed object.
 */
function parseSchemaCode(raw: string | Record<string, unknown>): Record<string, unknown> | null {
  if (!raw) return null;

  // Already a parsed object (JSONB from DB)
  if (typeof raw === "object") return raw;

  const str = raw.trim();

  // Extract JSON from between <script> tags
  const match = str.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  const jsonStr = match ? match[1].trim() : str;

  if (!jsonStr.startsWith("{") && !jsonStr.startsWith("[")) return null;

  // Fix trailing commas before } or ] — common in hand-written CMS JSON
  const cleaned = jsonStr.replace(/,(\s*[}\]])/g, "$1");

  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Fetches the CMS `schema` endpoint and returns JSON-LD objects.
 *
 * Entries with an empty/null slug are global; entries with a slug belong to
 * that one page. The `scope` selects which set to return:
 *   - "global" → only slug-less entries  (injected once in the root layout)
 *   - "page"   → only entries whose slug matches `currentPath`  (per-page)
 *   - "all"    → both
 *
 * Splitting global vs page lets the layout stay statically renderable: it
 * doesn't need the request path (`headers()`), which would force every route
 * into dynamic rendering. Pages opt into their own schema via
 * <PageSchemas slug="…" />.
 *
 * The API stores slugs without a leading slash ("gallery", "notice"), so both
 * sides are normalised before comparison.
 */
export async function buildCmsSchemas(
  currentPath = "/",
  scope: "all" | "global" | "page" = "all"
): Promise<Record<string, unknown>[]> {
  const entries = await getSchemaEntries();

  const page = normaliseSlug(currentPath); // "" for homepage

  const relevant = entries.filter((entry) => {
    const isGlobal = !entry.slug;
    if (scope === "global") return isGlobal;
    if (scope === "page") return !isGlobal && normaliseSlug(entry.slug!) === page;
    return isGlobal || normaliseSlug(entry.slug!) === page;
  });

  const schemas: Record<string, unknown>[] = [];

  // ── 1. schema_code — the backend provides a full <script> block ──────────
  for (const entry of relevant) {
    if (!entry.schema_code) continue;
    const parsed = parseSchemaCode(entry.schema_code);
    if (parsed) schemas.push(parsed);
  }

  // ── 2. FAQPage — built from the structured faq_schema Q&A pairs ──────────
  const faqs: { q: string; a: string }[] = [];
  for (const entry of relevant) {
    if (!Array.isArray(entry.faq_schema)) continue;
    for (const item of entry.faq_schema) {
      const q = item.q?.trim();
      const a = item.a?.trim();
      if (q && a) faqs.push({ q, a });
    }
  }

  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }

  return schemas;
}
