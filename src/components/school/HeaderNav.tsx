"use client";

import Link from "next/link";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";

/** Desktop nav with hover/focus dropdowns. Phones use MenuOverlay instead. */
export default function HeaderNav({ menu }: { menu: NavItem[] }) {
  const pathname = usePathname();
  const isActive = (item: NavItem) =>
    [item, ...(item.subLinks ?? [])].some((i) => (i.link === "/" ? pathname === "/" : pathname.startsWith(i.link)));

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      {menu.map((m) => (
        <div key={m.id} className="group relative">
          <Link
            href={m.link}
            aria-current={isActive(m) ? "page" : undefined}
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold transition-colors hover:text-maroon ${
              isActive(m) ? "text-maroon" : "text-ink/80"
            }`}
          >
            {m.title}
            {m.subLinks && <i className="fa-solid fa-chevron-down text-[9px] opacity-60" aria-hidden="true"></i>}
          </Link>
          {isActive(m) && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-maroon" aria-hidden="true"></span>}
          {m.subLinks && (
            <div className="invisible absolute left-0 top-full z-10 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="min-w-56 rounded-lg border border-ink/10 bg-white p-1.5 shadow-lg">
                {m.subLinks.map((s) => (
                  <li key={s.id}>
                    <NavLink href={s.link} className="block rounded-md px-3 py-2 text-sm font-semibold text-ink/80 hover:bg-maroon/10 hover:text-maroon">
                      {s.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
