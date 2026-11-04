import type { Metadata } from "next";
import { site } from "./site";

/** Static per-page metadata (title uses the layout's "%s | Apex Life School" template). */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      ...(image && { images: [{ url: image }] }),
    },
  };
}
