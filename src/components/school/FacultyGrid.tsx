"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { FacultyCategory, FacultyMember } from "@/lib/faculty";

const bars = ["bg-leaf", "bg-maroon", "bg-sun", "bg-maroon-deep"];

function Portrait({ member, sizes, className }: { member: FacultyMember; sizes: string; className?: string }) {
  return member.photo ? (
    <Image src={member.photo} alt={member.name} fill sizes={sizes} className={`object-cover object-top ${className ?? ""}`} />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-maroon-deep text-paper/30">
      <i className="fa-solid fa-user text-6xl" aria-hidden="true" />
    </div>
  );
}

/** Faculty grouped by category; each portrait card opens a pop-out with the teacher's details. */
export default function FacultyGrid({ categories }: { categories: FacultyCategory[] }) {
  const [active, setActive] = useState<FacultyMember | null>(null);
  const [visible, setVisible] = useState(false);

  const open = (m: FacultyMember) => setActive(m);
  const close = () => {
    setVisible(false);
    setTimeout(() => setActive(null), 250);
  };

  // Mount first, then flip `visible` on the next frame so the enter transition runs.
  useEffect(() => {
    if (!active) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      {categories.map((cat) => (

        <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-title`} className="mb-16 last:mb-0">
          <h4 id={`${cat.id}-title`} className="mb-6 font-display text-2xl font-semibold text-maroon">
            {cat.title}
          </h4>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cat.members.map((m, i) => {
              const hasDetails = Boolean(m.bio || m.qualification || m.email);
              const cardClass =
                "group relative block aspect-3/4 w-full overflow-hidden rounded-xl bg-ink text-left shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun";
              const card = (
                <>
                  <Portrait member={m} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className={hasDetails ? "transition duration-300 group-hover:scale-105" : ""} />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-5 pb-6 text-paper">
                    <p className="font-display text-2xl font-bold leading-tight">{m.name}</p>
                    <p className="mt-1 text-sm leading-snug">{m.role}</p>
                  </div>
                  <span className={`absolute inset-x-0 bottom-0 h-2 ${bars[i % bars.length]}`} aria-hidden="true" />
                </>
              );
              return (
                <li key={`${m.name}-${i}`}>
                  {hasDetails ? (
                    <button type="button" onClick={() => open(m)} aria-haspopup="dialog" className={`${cardClass} cursor-pointer`}>
                      {card}
                    </button>
                  ) : (
                    <div className={cardClass}>{card}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {active && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-3 transition-opacity duration-250 ease-out sm:p-8 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
            onClick={(e) => e.stopPropagation()}
            className={`relative flex max-h-full w-full max-w-5xl flex-col overflow-y-auto rounded-xl bg-white shadow-2xl transition duration-250 ease-out motion-reduce:transition-none md:flex-row md:overflow-hidden ${
              visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              autoFocus
              className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-maroon bg-white text-maroon hover:bg-maroon hover:text-paper"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>

            <div className="flex shrink-0 items-center justify-center bg-maroon p-6 md:w-2/5 md:p-10">
              <div className="relative aspect-5/7 w-full max-w-sm overflow-hidden rounded-lg">
                <Portrait member={active} sizes="(min-width: 768px) 400px, 100vw" />
              </div>
            </div>

            <div className="p-6 md:max-h-[85vh] md:flex-1 md:overflow-y-auto md:p-10">
              <h3 className="pr-12 font-display text-4xl font-bold text-ink/80">{active.name}</h3>
              <p className="mt-4 text-lg text-ink/70">{active.role}</p>
              {active.qualification && <p className="mt-5 text-ink/70">{active.qualification}</p>}
              {active.email && (
                <p className="mt-5">
                  <a href={`mailto:${active.email}`} className="border-b-2 border-leaf font-semibold text-ink">
                    {active.email}
                  </a>
                </p>
              )}
              {active.bio && <p className="mt-6 leading-7 text-ink/70">{active.bio}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
