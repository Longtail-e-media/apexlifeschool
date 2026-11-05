import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import SectionNav from "./SectionNav";
import { SITE_URL } from "@/lib/site";
import { getMainMenu } from "@/lib/cms";

export interface Crumb {
  name: string;
  href?: string;
}

const DEFAULT_BANNER = "/apex/brand/heroImage.jpeg";

/** Banner with the page title, breadcrumbs + BreadcrumbList data, and the section's submenu shown openly below it. */
export default async function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
  image = DEFAULT_BANNER,
}: {
  title: string;
  intro?: ReactNode;
  eyebrow?: string;
  crumbs: Crumb[];
  /** Banner background; falls back to the school hero photo. */
  image?: string;
}) {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...crumbs];
  const menu = await getMainMenu();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href && { item: `${SITE_URL}${c.href === "/" ? "" : c.href}` }),
    })),
  };

  return (
    <section>
      <JsonLd schema={schema} />
      <div className="relative isolate overflow-hidden bg-maroon-deep text-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-maroon-deep/70" aria-hidden="true"></div>
        <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col px-4 pb-16 pt-6 sm:px-6">

          <h1 className="my-auto py-6 text-center font-display text-4xl font-bold uppercase leading-tight tracking-widest sm:text-6xl">
            {title}
          </h1>
        </div>
      </div>

      <SectionNav menu={menu} />

      {(eyebrow || intro) && (
        <div className="mx-auto max-w-7xl px-4 pt-10 text-center sm:px-6">
          {eyebrow && <p className="font-hand text-5xl leading-none text-maroon">{eyebrow}</p>}
          {intro && <p className="mx-auto mt-3 max-w-2xl leading-7 text-ink/70">{intro}</p>}
        </div>
      )}
    </section>
  );
}
