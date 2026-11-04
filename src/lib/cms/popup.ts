import { fetchAPI } from "../api";
import { list } from "./helpers";

export interface PopupSlide {
  title?: string;
  src?: string;           // video URL
  imglink?: { id: number; url: string; alt: string }[];
  link?: string;
  link_type?: number | string;
  orientation?: string;
  start_date?: string;
  end_date?: string;
  popupType: "image" | "video";
}

export interface PopupGroup {
  type: "image" | "video";
  items: Omit<PopupSlide, "popupType">[];
}

export async function getPopupData(): Promise<PopupSlide[]> {
  try {
    const groups = list<PopupGroup>(await fetchAPI<unknown>("popup"));
    return groups.flatMap((g) =>
      list<Omit<PopupSlide, "popupType">>(g.items).map((item) => ({
        ...item,
        popupType: g.type,
      }))
    );
  } catch {
    return [];
  }
}
