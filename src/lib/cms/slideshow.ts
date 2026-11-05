import { fetchAPI } from "../api";
import { toPath } from "./helpers";
import type { HeroSlide } from "@/types";

interface ApiSlideGroup {
  mediaType?: string;
  items?: {
    id?: string;
    title?: string;
    src?: string;
    video?: string;
    description?: string;
    buttonLink?: string;
    text?: string;
    linktype?: string;
    tag?: string;
  }[];
}

/** First video URL from the `slideshow` API's `mediaType: "video"` group. */
export async function getSlideshowVideo(): Promise<string | undefined> {
  const groups = await fetchAPI<ApiSlideGroup[]>("slideshow");
  const group = groups?.find((g) => g.mediaType === "video");
  const item = group?.items?.find((s) => s.src || s.video);
  return item?.src ?? item?.video;
}

export async function getSlideshow(): Promise<HeroSlide[]> {
  const groups = await fetchAPI<ApiSlideGroup[]>("slideshow");
  const items = groups?.[0]?.items ?? [];

  return items
    .filter((s) => s.src || s.video)
    .map((s, idx) => ({
      id: s.id ?? `slide-${idx}`,
      title: s.title ?? "",
      description: s.description ?? "",
      src: s.src,
      video: s.video,
      mediaType: s.video ? "video" : "image",
      buttonLink: s.buttonLink ? toPath(s.buttonLink) : undefined,
      tag: s.tag,
    }));
}
