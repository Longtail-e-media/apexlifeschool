import Link from "next/link";
import type { ComponentProps } from "react";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * Link that opens external URLs in a new tab and internal routes normally.
 * Used for "Apply" buttons so `links.admissionForm` can be switched between the vendor form
 * and the on-site /admission-form without touching any component.
 */
export default function ApplyLink({ href, children, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  if (isExternal(href)) {
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
