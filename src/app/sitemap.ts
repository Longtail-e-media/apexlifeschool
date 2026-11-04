import type { MetadataRoute } from "next";
import { getNews } from "@/lib/cms";
import { SITE_URL } from "@/lib/site";

/** Generates /sitemap.xml dynamically from the site's pages and live CMS news posts. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const news = await getNews();

  const pages: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
    ["/", "weekly", 1],
    ["/admissions", "weekly", 0.9],
    ["/why-apex", "monthly", 0.7],
    ["/curriculum", "monthly", 0.7],
    ["/video-gallery", "monthly", 0.4],
    ["/testimonials", "monthly", 0.4],
    ["/about-us", "monthly", 0.8],
    ["/message-from-chairperson", "yearly", 0.5],
    ["/message-from-principal", "yearly", 0.5],
    ["/facilities", "monthly", 0.7],
    ["/activities", "monthly", 0.6],
    ["/events", "weekly", 0.4],
    ["/news", "weekly", 0.7],
    ["/notice", "daily", 0.7],
    ["/gallery", "monthly", 0.6],
    ["/contact-us", "yearly", 0.7],
  ];

  return [
    ...pages.map(([path, changeFrequency, priority]) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...news.map((n) => ({
      url: `${SITE_URL}/news/${n.slug}`,
      lastModified: n.date ? new Date(n.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
