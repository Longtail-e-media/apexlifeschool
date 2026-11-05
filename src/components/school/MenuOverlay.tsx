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

const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

/** Full-screen menu used at every breakpoint. Contact details come in as props so no page content ships to the client. */
export default function MenuOverlay({ menu, phones, email, address, hours }: Props) {
  const pathname = usePathname();
  // The menu is "open" only for the path it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  // Defaults to the first item that has a submenu so the right column is never empty on desktop.
  const current = menu.find((m) => m.id === activeId) ?? menu.find((m) => m.subLinks?.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPath(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      cancelAnimationFrame(raf);
    };
  }, [open]);

  const contact = (
    <>
      {address && <span>{address}</span>}
      {phones.map((p) => (
        <a key={p} href={tel(p)} className="hover:text-sun">{p}</a>
      ))}
      {email && <a href={`mailto:${email}`} className="hover:text-sun">{email}</a>}
      {hours && <span>{hours}</span>}
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label="Open menu"
        className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-maroon/10 text-maroon transition duration-300 hover:scale-105 hover:bg-maroon hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon active:scale-95"
      >
        <span className="flex w-5 flex-col items-start gap-[5px]" aria-hidden="true">
          <span className="block h-0.5 w-5 rounded-full bg-current transition-all duration-300"></span>
          <span className="block h-0.5 w-3.5 rounded-full bg-current transition-all duration-300 group-hover:w-5"></span>
          <span className="block h-0.5 w-5 rounded-full bg-current transition-all duration-300"></span>
        </span>
      </button>

      {/* Always mounted so it can animate; `inert` + visibility keep it out of reach while closed. */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`fixed inset-0 z-60 overflow-y-auto bg-paper text-ink transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="grid min-h-full lg:grid-cols-[minmax(0,30rem)_1fr]">
          {/* Brand panel */}
          <div className="relative hidden overflow-hidden bg-maroon-deep text-paper lg:flex lg:flex-col lg:justify-between lg:p-12">
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-120 w-120 rounded-full bg-sun/90" aria-hidden="true"></div>
            <div className="pointer-events-none absolute -bottom-72 -left-72 h-200 w-200 rounded-full border border-paper/15" aria-hidden="true"></div>
            <div className="pointer-events-none absolute -bottom-96 -left-96 h-280 w-280 rounded-full border border-paper/10" aria-hidden="true"></div>
            <span
              className="pointer-events-none absolute -right-6 top-10 select-none font-display text-[22rem] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgb(255_255_255/0.18)]"
              aria-hidden="true"
            >
              A
            </span>

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sun">Welcome to</p>
              <p className="mt-3 font-display text-4xl font-bold uppercase leading-tight">
                Apex<br />Life School
              </p>
            </div>

            <address className="relative flex flex-col gap-2 rounded-xl bg-maroon-deep/80 p-5 text-sm not-italic text-paper/85 backdrop-blur-sm">
              {contact}
            </address>
          </div>

          {/* Links */}
          <div className="flex flex-col px-4 pb-10 sm:px-8 lg:px-16">
            <div className="flex h-16 items-center justify-between lg:h-24">
              <span className="text-xs font-bold uppercase tracking-widest text-ink/50 lg:hidden">Apex Life School</span>
              <span className="hidden text-xs font-bold uppercase tracking-[0.3em] text-ink/40 lg:block">Navigate</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-maroon/10 text-lg text-maroon transition duration-300 hover:rotate-90 hover:bg-maroon hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>

            <div className="mt-4 grid flex-1 content-start gap-x-12 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <nav aria-label="Site">
                <ul className="space-y-1 lg:space-y-4">
                  {menu.map((m, i) => {
                    const isOn = m.id === current?.id;
                    return (
                      <li
                        key={m.id}
                        onMouseEnter={() => setActiveId(m.id)}
                        style={{ transitionDelay: open ? `${250 + i * 50}ms` : "0ms" }}
                        className={`transition-all duration-500 ease-out ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Link
                            href={m.link}
                            onFocus={() => setActiveId(m.id)}
                            className={`group/link flex items-baseline gap-3 font-display text-2xl font-bold uppercase tracking-wide transition-colors hover:text-maroon sm:text-3xl lg:text-4xl ${
                              isOn ? "text-maroon" : "text-ink"
                            }`}
                          >
                            <span className="w-6 text-xs font-bold tracking-widest text-ink/30 transition-colors group-hover/link:text-sun">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="transition-transform duration-300 group-hover/link:translate-x-2">{m.title}</span>
                          </Link>
                          {m.subLinks && (
                            <button
                              type="button"
                              onClick={() => setActiveId(isOn ? "" : m.id)}
                              aria-expanded={isOn}
                              aria-label={`${m.title} submenu`}
                              className="cursor-pointer p-2 text-xs text-ink/60 lg:hidden"
                            >
                              <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOn ? "rotate-180" : ""}`} aria-hidden="true"></i>
                            </button>
                          )}
                        </div>
                        {m.subLinks && (
                          <div
                            inert={!isOn}
                            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
                              isOn ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <ul className="mb-3 mt-2 space-y-1 overflow-hidden border-l-2 border-maroon/30 pl-4">
                              {m.subLinks.map((s) => (
                                <li key={s.id}>
                                  <NavLink href={s.link} className="block py-1 text-base font-semibold text-ink/75 hover:text-maroon">
                                    {s.title}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="hidden border-l border-ink/10 pl-10 pt-1 lg:grid">
                {menu.map((m) => {
                  if (!m.subLinks) return null;
                  const isOn = m.id === current?.id;
                  return (
                    <ul
                      key={m.id}
                      inert={!isOn}
                      aria-label={`${m.title} links`}
                      className={`col-start-1 row-start-1 space-y-4 self-start transition-all duration-300 ease-out ${
                        isOn ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0"
                      }`}
                    >
                      {m.subLinks.map((s, i) => (
                        <li
                          key={s.id}
                          style={{ transitionDelay: isOn ? `${i * 30}ms` : "0ms" }}
                          className={`transition-all duration-300 ${isOn ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
                        >
                          <NavLink href={s.link} className="text-lg font-semibold text-ink/75 hover:text-maroon">
                            {s.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </div>
            </div>

            <address className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-ink/10 pt-6 text-sm not-italic text-ink/70 lg:hidden">
              {contact}
            </address>
          </div>
        </div>
      </div>
    </>
  );
}
