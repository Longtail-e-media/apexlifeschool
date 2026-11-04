"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/cms";

const PAGE = 12;
const ALL = "All photos";
const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.8deg]"];

// Local files go through the image optimizer; remote CMS hosts are served as-is.
const unopt = (src: string) => !src.startsWith("/");

/** One-page gallery: category tabs, photo grid, "Load more", and a full-screen viewer with download. */
export default function GalleryView({ items }: { items: GalleryItem[] }) {
  const categories = [ALL, ...Array.from(new Set(items.map((i) => i.category)))];
  const [active, setActive] = useState(ALL);
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const filtered = active === ALL ? items : items.filter((i) => i.category === active);
  const shown = filtered.slice(0, visible);

  const go = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + filtered.length) % filtered.length)),
    [filtered.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const returnTo = lastFocus.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      returnTo?.focus();
    };
  }, [open, go]);

  const current = open !== null ? filtered[open] : null;

  return (
    <>
      {/* Category tabs */}
      <div role="group" aria-label="Filter photos by album" className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => {
              setActive(c);
              setVisible(PAGE);
            }}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              active === c ? "bg-maroon text-paper" : "bg-white text-ink/75 ring-1 ring-ink/15 hover:ring-maroon hover:text-maroon"
            }`}
          >
            {c}
            <span className={`ml-2 text-xs ${active === c ? "text-paper/70" : "text-ink/45"}`}>
              {c === ALL ? items.length : items.filter((i) => i.category === c).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={(e) => {
                lastFocus.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Open photo: ${item.title}`}
              className={`group relative block aspect-square w-full overflow-hidden rounded-sm border-4 border-white bg-blush shadow-md transition hover:rotate-0 hover:shadow-xl ${tilts[i % tilts.length]}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                preload={i < 4}
                unoptimized={unopt(item.image)}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 to-transparent p-3 pt-8 text-left text-xs font-bold text-paper opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.category}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-10 rounded-xl bg-white p-10 text-center font-semibold text-ink/60">No photos in this album yet.</p>
      )}

      {filtered.length > shown.length && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="rounded-md border-2 border-maroon px-8 py-3 font-bold text-maroon transition hover:bg-maroon hover:text-paper"
          >
            Load more photos <i className="fa-solid fa-angles-down ml-2 text-sm" aria-hidden="true"></i>
          </button>
          <p className="mt-3 text-sm text-ink/55">Showing {shown.length} of {filtered.length} photos</p>
        </div>
      )}

      {/* Viewer */}
      {current && open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-70 flex flex-col bg-ink/95 text-paper">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm font-semibold">Photo {open + 1} of {filtered.length}</p>
            <div className="flex items-center gap-2">
              <a
                href={current.image}
                download
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download this photo"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper/10"
              >
                <i className="fa-solid fa-download" aria-hidden="true"></i>
              </a>
              <button ref={closeRef} type="button" onClick={() => setOpen(null)} aria-label="Close viewer (Esc)" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper/10">
                <i className="fa-solid fa-xmark text-lg" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            <Image
              key={current.id}
              src={current.image}
              alt={current.title}
              fill
              unoptimized={unopt(current.image)}
              sizes="100vw"
              className="object-contain p-4"
            />
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo (Left arrow)" className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 ring-1 ring-paper/30 hover:bg-paper/20 sm:left-6">
              <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo (Right arrow)" className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 ring-1 ring-paper/30 hover:bg-paper/20 sm:right-6">
              <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>

          <div className="px-4 py-4 text-center">
            <span className="rounded-full bg-paper/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">{current.category}</span>
            <p className="mt-2 font-display text-lg">{current.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
