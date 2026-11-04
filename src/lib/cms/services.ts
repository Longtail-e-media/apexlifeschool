import { fetchAPI } from "../api";
import { list, toParagraphs, toListItems } from "./helpers";

interface ApiService {
  title?: string;
  content_0?: string | null;
  gallery_images?: { src?: string }[];
}

/** `services` is grouped by type: 1 = facilities, 2 = activities. */
async function getServiceGroup(type: 1 | 2): Promise<ApiService[]> {
  const data = list<{ type?: number | string; items?: ApiService[] }>(await fetchAPI<unknown>("services"));
  return data.find((g) => Number(g.type) === type)?.items ?? [];
}

export interface Facility {
  title: string;
  image: string | null;
  text: string;
}

export async function getFacilities(): Promise<Facility[]> {
  const items = (await getServiceGroup(1)).filter((s) => s.title);
  return items.map((s) => ({
    title: s.title as string,
    image: s.gallery_images?.[0]?.src ?? null,
    text: toParagraphs(s.content_0 ?? "").join(" "),
  }));
}

export interface Activity {
  title: string;
  image: string | null;
  text: string;
  items: string[];
}

export async function getActivities(): Promise<Activity[]> {
  const items = (await getServiceGroup(2)).filter((s) => s.title);
  return items.map((s) => ({
    title: s.title as string,
    image: s.gallery_images?.[0]?.src ?? null,
    text: toParagraphs(s.content_0 ?? "").join(" "),
    items: toListItems(s.content_0 ?? ""),
  }));
}
