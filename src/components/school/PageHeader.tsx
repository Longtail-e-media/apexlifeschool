import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

export interface Crumb {
  name: string;
  href?: string;
}

/** Page title block with visible breadcrumbs + BreadcrumbList structured data. */
export default function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
}: {
  title: string;
  intro?: ReactNode;
  eyebrow?: string;
  crumbs: Crumb[];
}) {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...crumbs];

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
    <section className="ruled border-b border-ink/10">
      <JsonLd schema={schema} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
            {trail.map((c, i) => (
              <li key={`${c.name}-${i}`} className="flex items-center gap-2">
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="hover:text-maroon hover:underline">{c.name}</Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-ink/80">{c.name}</span>
                )}
                {i < trail.length - 1 && <i className="fa-solid fa-chevron-right text-[9px]" aria-hidden="true"></i>}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && <p className="mt-6 font-hand text-2xl leading-none text-maroon">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-1" : "mt-5"} max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl`}>
          {title}
        </h1>
        {intro && <p className="mt-4 max-w-2xl leading-7 text-ink/70">{intro}</p>}
      </div>
    </section>
  );
}
