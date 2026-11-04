import { MetadataRoute } from "next";

/**
 * Generates /robots.txt.
 *
 * The site is always indexable + followable; admin/API internals are
 * excluded. (The CMS `robots_txt` field in siteregulars targets the PHP
 * backend paths, not this frontend, so it is intentionally not used here.)
 */
export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apexlifeschool.edu.np";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
