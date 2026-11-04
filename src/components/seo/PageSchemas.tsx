import JsonLd from "./JsonLd";
import { buildCmsSchemas } from "@/lib/metadata";

/**
 * Injects the CMS-managed JSON-LD for one page, matched by its **CMS `slug`**
 * (the `slug` field in the `schema` API), NOT the route path — the two differ
 * (e.g. CMS slug "contact" lives at route "/contact-us", "home" at "/").
 *
 *   <PageSchemas slug="contact" />   // on /contact-us
 *   <PageSchemas slug="home" />      // on /
 *
 * Renders both the entry's `schema_code` block and an FAQPage built from its
 * `faq_schema` Q&A pairs. Slug-less (global) entries are injected once in the
 * root layout instead. Async Server Component — cached fetch, no client JS,
 * renders nothing when the page has no matching schema.
 */
export default async function PageSchemas({ slug }: { slug: string }) {
  const schemas = await buildCmsSchemas(slug, "page");
  if (schemas.length === 0) return null;
  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} schema={schema} />
      ))}
    </>
  );
}
