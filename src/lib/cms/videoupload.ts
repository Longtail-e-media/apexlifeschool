import { fetchAPI } from "../api";
import { list } from "./helpers";

export interface VideoItem {
  id: string;
  title: string;
  subTitle?: string;
  text?: string;
  src: string;
  type?: string;
}

type ApiVideoItem = {
  id?: string | number;
  title?: string;
  sub_title?: string;
  src?: string;
  type?: string;
};

export const staticVideos: VideoItem[] = [
  {
    id: "static-1",
    src: "/apex/video/xTqwM8R.mp4",
    title: "Introducing Apex Life School",
    subTitle: "Who we are and what a day at Apex feels like.",
    text: "Who we are and what a day at Apex feels like.",
    type: "upload",
  },
  {
    id: "static-2",
    src: "/apex/video/ilVOIoi.mp4",
    title: "A glimpse of Apex",
    subTitle: "School life at Apex Life School, in motion.",
    text: "School life at Apex Life School, in motion.",
    type: "upload",
  },
];

/**
 * Normalises video upload API response.
 */
export function normalizeVideos(data: unknown): VideoItem[] {
  const items = list<ApiVideoItem>(data)
    .filter((v) => v && typeof v.src === "string" && v.src)
    .map((v, i) => ({
      id: String(v.id ?? i),
      title: v.title?.trim() || "Apex Life School",
      subTitle: v.sub_title?.trim() || "",
      text: v.sub_title?.trim() || "",
      src: v.src as string,
      type: v.type || "upload",
    }));

  return items.length > 0 ? items : staticVideos;
}

/**
 * Fetches uploaded school videos from /videoupload endpoint.
 * Falls back to static video list if API is unreachable or empty.
 */
export async function getVideoUploads(): Promise<VideoItem[]> {
  try {
    const data = await fetchAPI<ApiVideoItem[]>("videoupload");
    return normalizeVideos(data);
  } catch {
    return staticVideos;
  }
}

export const getVideos = getVideoUploads;
