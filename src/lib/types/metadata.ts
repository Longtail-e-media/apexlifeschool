/**
 * Slugs of the entries in the CMS `schema` API that carry per-page meta
 * (meta_title / meta_keywords / meta_description + JSON-LD).
 * Global defaults live in the `siteregulars` endpoint.
 *
 * `buildMetadata` also accepts arbitrary strings — unknown slugs simply
 * fall back to the siteregulars globals.
 */
export type PageMetaKey =
  | "home"
  | "facilities"
  | "gallery"
  | "blog"
  | "notice"
  | "contact";
