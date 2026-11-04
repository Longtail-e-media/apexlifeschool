import { fetchAPI } from "../api";
import { list } from "./helpers";
import { galleryAlbums } from "../site";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

type ApiGalleryItem = { id?: string | number; title?: string; category?: string; image?: string };
type ApiGalleryGroup = { display?: string; items?: ApiGalleryItem[] };

/** Each extracted album from static site becomes a category fallback. */
export function staticGallery(): GalleryItem[] {
  return galleryAlbums.flatMap((a) =>
    a.images.map((image, i) => ({
      id: `${a.id}-${i}`,
      title: `${a.title} — photo ${i + 1}`,
      category: a.title,
      image,
    })),
  );
}

/**
 * Normalises gallery API responses (flat items or groups with items).
 */
export function normalizeGallery(data: unknown): GalleryItem[] {
  const groups = list<ApiGalleryGroup>(data);
  const items = groups
    .flatMap((g) => (g && typeof g === "object" && "items" in g ? list<ApiGalleryItem>(g.items) : [g as ApiGalleryItem]))
    .filter((r) => r && typeof r.image === "string" && r.image)
    .map((r, i) => ({
      id: String(r.id ?? i),
      title: r.title?.trim() || "Apex Life School",
      category: r.category?.trim() || "School",
      image: r.image as string,
    }));

  return items.length > 0 ? items : staticGallery();
}

/**
 * Fetches the photo gallery from /gallery.
 * Falls back to static album gallery if API has no images or fails.
 */
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const data = await fetchAPI<ApiGalleryGroup[]>("gallery");
    return normalizeGallery(data);
  } catch {
    return staticGallery();
  }
}
