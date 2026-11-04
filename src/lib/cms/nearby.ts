import { fetchAPI } from "../api";
import { list } from "./helpers";

export interface NearbyPlace {
  name: string;
  distance: string;
  icon: string;
  lat: number;
  lng: number;
  mode: "walking" | "driving";
}

function distanceKm(d: string): number {
  const n = parseFloat(d.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return Infinity;
  return /\bkm\b/i.test(d) ? n : n / 1000;
}

export async function getNearby(): Promise<NearbyPlace[]> {
  const rows = list<{ title?: string; subtitle?: string; map_url?: string; distance?: string }>(await fetchAPI<unknown>("nearby"));
  const places = rows.flatMap((r) => {
    const [lat, lng] = (r.map_url ?? "").split(",").map((v) => parseFloat(v));
    if (!r.title || !Number.isFinite(lat) || !Number.isFinite(lng)) return [];
    const distance = r.distance?.trim() ?? "";
    return [
      {
        name: r.title,
        distance,
        icon: (r.subtitle ?? "").replace(/\bfa-(solid|regular|brands)\b/g, "").trim() || "fa-location-dot",
        lat,
        lng,
        mode: distanceKm(distance) <= 1 ? ("walking" as const) : ("driving" as const),
      },
    ];
  });
  return places.sort((a, b) => distanceKm(a.distance) - distanceKm(b.distance));
}
