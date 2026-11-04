"use client";

import { useRef, useState } from "react";

interface Place {
  name: string;
  distance: string;
  icon: string;
  lat: number;
  lng: number;
  mode: "walking" | "driving";
}

/**
 * Landmark list + map. Clicking a landmark shows the route from it to the school; the school row resets the map.
 * Uses the keyless Google Maps embed (`saddr`/`daddr`), so no API key is needed.
 */
export default function NearbyExplorer({ places, school }: { places: Place[]; school: { lat: number; lng: number } }) {
  const [active, setActive] = useState<Place | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const dest = `${school.lat},${school.lng}`;
  const src = active
    ? `https://www.google.com/maps?saddr=${active.lat},${active.lng}&daddr=${dest}&dirflg=${active.mode === "walking" ? "w" : "d"}&output=embed`
    : `https://www.google.com/maps?q=${dest}&z=15&output=embed`;

  const externalHref = active
    ? `https://www.google.com/maps/dir/?api=1&origin=${active.lat},${active.lng}&destination=${dest}&travelmode=${active.mode}`
    : `https://www.google.com/maps/dir/?api=1&destination=${dest}`;

  const choose = (place: Place | null) => {
    setActive(place);
    // On phones the map sits below the list: bring it into view if it isn't.
    const el = mapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // "auto" would still animate because the page sets `scroll-behavior: smooth`, so jump explicitly for reduced motion.
      el.scrollIntoView({ behavior: calm ? "instant" : "smooth", block: "center" });
    }
  };

  const row = "flex w-full items-center gap-4 px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-maroon";

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <div className="min-w-0">
        <p className="max-w-md leading-7 text-ink/70">
          We are in Saraswotinagar, a short distance from some of Kathmandu’s best-known landmarks. Tap a place to see the route from there to the school. Distances are in a straight line, so allow a little more for the road.
        </p>

        <ol className="mt-6 overflow-hidden rounded-xl border border-ink/10 bg-white">
          <li>
            <button
              type="button"
              onClick={() => choose(null)}
              aria-pressed={active === null}
              className={`${row} ${active === null ? "bg-maroon text-paper" : "bg-maroon/90 text-paper hover:bg-maroon"}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/15" aria-hidden="true">
                <i className="fa-solid fa-location-dot text-sm"></i>
              </span>
              <span className="min-w-0 flex-1 font-bold">Apex Life School</span>
              <span className="text-xs font-bold uppercase tracking-widest text-sun">You are here</span>
            </button>
          </li>
          {places.map((n) => {
            const on = active?.name === n.name;
            return (
              <li key={n.name} className="border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => choose(n)}
                  aria-pressed={on}
                  aria-label={`${n.name}, ${n.distance} from the school. Show the route on the map.`}
                  className={`${row} ${on ? "bg-maroon/10" : "hover:bg-paper"}`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${on ? "bg-maroon text-paper" : "bg-mint text-leaf-deep"}`}
                    aria-hidden="true"
                  >
                    <i className={`fa-solid ${n.icon} text-sm`}></i>
                  </span>
                  <span className={`min-w-0 flex-1 text-sm sm:text-base ${on ? "font-bold text-maroon" : "font-semibold"}`}>{n.name}</span>
                  <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-xs font-bold text-maroon">{n.distance}</span>
                  <i
                    className={`fa-solid ${on ? "fa-route text-maroon" : "fa-chevron-right text-ink/30"} shrink-0 text-xs`}
                    aria-hidden="true"
                  ></i>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div ref={mapRef} className="min-w-0 scroll-mt-24 lg:flex lg:flex-col">
        <p role="status" aria-live="polite" className="mb-3 text-sm font-semibold text-ink/70">
          {active ? (
            <>
              <i className={`fa-solid ${active.mode === "walking" ? "fa-person-walking" : "fa-car"} mr-2 text-maroon`} aria-hidden="true"></i>
              Route from <strong className="text-ink">{active.name}</strong> to Apex Life School
            </>
          ) : (
            <>
              <i className="fa-solid fa-location-dot mr-2 text-maroon" aria-hidden="true"></i>
              Apex Life School, Saraswotinagar
            </>
          )}
        </p>

        <iframe
          title={active ? `Map: route from ${active.name} to Apex Life School` : "Map showing Apex Life School"}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-96 w-full rounded-xl border border-ink/10 lg:min-h-130 lg:flex-1"
        />

        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 self-start rounded-md bg-maroon px-6 py-3 font-bold text-paper transition hover:bg-maroon-deep"
        >
          <i className="fa-solid fa-diamond-turn-right" aria-hidden="true"></i>
          {active ? "Open this route in Google Maps" : "Get directions"}
        </a>
      </div>
    </div>
  );
}
