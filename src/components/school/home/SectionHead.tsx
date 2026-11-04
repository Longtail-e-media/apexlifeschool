import Link from "next/link";
import type { ReactNode } from "react";

/** One heading style for every section: handwritten label, serif title, optional link. */
export default function SectionHead({
  eyebrow,
  title,
  href,
  linkText,
}: {
  eyebrow: string;
  title: ReactNode;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="font-hand text-2xl leading-none text-maroon">{eyebrow}</p>
        <h2 className="mt-1 max-w-2xl font-display text-2xl font-semibold leading-snug sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-bold text-maroon hover:underline">
          {linkText} <i className="fa-solid fa-arrow-right ml-1 text-xs" aria-hidden="true"></i>
        </Link>
      )}
    </div>
  );
}
