/**
 * JsonLd — injects a <script type="application/ld+json"> block into the
 * document <head> for Schema.org structured data.
 *
 * This is a server component — no "use client" directive needed.
 * Pass any valid Schema.org object (or array of objects) as `schema`.
 *
 * @example
 * <JsonLd schema={{ "@context": "https://schema.org", "@type": "Organization", ... }} />
 */
export default function JsonLd({ schema }: { schema: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is safe here because we control the schema object
      // and JSON.stringify escapes all special characters.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
