import { fetchAPI } from "../api";
import { list } from "./helpers";

export interface LifeAtApexItem {
  id?: string;
  name: string;
  role: string;
  poster: string;
  gif?: string;
  url: string;
  content?: string;
}

export type TestimonialItem = LifeAtApexItem;

export const staticTestimonials: LifeAtApexItem[] | null = null;

export async function getTestimonials(): Promise<LifeAtApexItem[]> {
  try {
    const rows = list<{
      id?: string | number;
      name?: string;
      via?: string;
      linksrc?: string;
      image?: string;
      url?: string;
      content?: string;
    }>(await fetchAPI<unknown>("testimonial"));

    return rows.flatMap((r) => {
      if (!r.name) return [];
      const videoUrl = r.linksrc?.trim() || r.url?.trim() || "";
      const poster = r.image?.trim() || "";

      return [
        {
          id: String(r.id ?? ""),
          name: r.name.trim(),
          role: r.via?.trim() || "Parent",
          poster,
          gif: r.image || poster,
          url: videoUrl,
          content: r.content?.trim() || "",
        },
      ];
    });
  } catch {
    return [];
  }
}

export const getLifeAtApex = getTestimonials;
