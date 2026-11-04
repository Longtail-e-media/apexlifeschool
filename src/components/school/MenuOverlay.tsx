"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";

interface Props {
  menu: NavItem[];
  phones: string[];
  email: string;
  address: string;
  hours: string;
}

/** Full-screen menu used at every breakpoint. Contact details come in as props so no page content ships to the client. */
export default function MenuOverlay({ menu, phones, email, address, hours }: Props) {
  const pathname = usePathname();
  // The menu is "open" only for the path it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPath(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        className="flex items-center gap-3 rounded-md border border-ink/20 py-2 pl-4 pr-3 text-sm font-bold transition hover:border-ink lg:hidden"
      >
        Menu
        <span className="flex flex-col gap-1" aria-hidden="true">
          <span className="block h-0.5 w-5 bg-ink"></span>
          <span className="block h-0.5 w-3 self-end bg-ink"></span>
        </span>
      </button>

      {open && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-60 lg:hidden overflow-y-auto bg-maroon-deep text-paper"
        >
          <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 pb-10 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-paper/60">Apex Life School</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md border border-paper/30 py-2 pl-4 pr-3 text-sm font-bold hover:border-paper"
              >
                Close <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>

            <div className="mt-8 grid flex-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
              <nav aria-label="Site">
                <ul className="space-y-2">
                  {menu.map((m) => (
                    <li key={m.id} className="border-b border-paper/15 pb-3">
                      <Link href={m.link} className="font-display text-3xl font-semibold hover:text-sun">
                        {m.title}
                      </Link>
                      {m.subLinks && (
                        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                          {m.subLinks.map((s) => (
                            <li key={s.id}>
                              <NavLink href={s.link} className="text-sm font-semibold text-paper/70 hover:text-sun">
                                {s.title}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <address className="space-y-6 self-end not-italic text-paper/85">
                <p>
                  <span className="block text-xs font-bold uppercase tracking-widest text-paper/50">Find us</span>
                  {address}
                </p>
                <p>
                  <span className="block text-xs font-bold uppercase tracking-widest text-paper/50">Call</span>
                  {phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/[^+\d]/g, "")}`} className="block hover:text-sun">{p}</a>
                  ))}
                </p>
                <p>
                  <span className="block text-xs font-bold uppercase tracking-widest text-paper/50">Email</span>
                  <a href={`mailto:${email}`} className="hover:text-sun">{email}</a>
                </p>
                <p className="text-sm text-paper/60">{hours}</p>
              </address>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
