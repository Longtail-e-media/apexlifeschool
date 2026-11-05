"use client";

import { usePathname } from "next/navigation";
import NavLink from "./NavLink";
import type { NavItem } from "@/types";

const norm = (p: string) => (p.split(/[?#]/)[0].replace(/\/+$/, "") || "/");

/** Opens the current section's submenu on the page itself, so visitors see every sibling page without the menu overlay. */
export default function SectionNav({ menu }: { menu: NavItem[] }) {
  const path = norm(usePathname());
  const section = menu.find((m) => m.subLinks?.length && (norm(m.link) === path || m.subLinks.some((s) => norm(s.link) === path)));
  if (!section?.subLinks) return null;

  return (
    <nav
      aria-label={`${section.title} pages`}
      className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6"
    >
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 rounded-3xl bg-white px-6 py-6 shadow-xl ring-1 ring-ink/10 sm:gap-x-10 sm:px-10 sm:py-8">
        {section.subLinks.map((s) => {
          const on = norm(s.link) === path;
          return (
            <li key={s.id}>
              <NavLink
                href={s.link}
                aria-current={on ? "page" : undefined}
                className={`border-b-2 pb-0.5 text-base transition-colors hover:text-maroon ${
                  on ? "border-maroon font-bold text-maroon" : "border-transparent text-ink/70"
                }`}
              >
                {s.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
