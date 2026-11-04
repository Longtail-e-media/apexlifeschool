import Link from "next/link";
import type { ComponentProps } from "react";

/** Menu link: external URLs open in a new tab, internal routes use next/link. */
export default function NavLink({ href, children, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...(rest as ComponentProps<"a">)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
