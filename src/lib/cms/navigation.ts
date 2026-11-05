import { fetchAPI } from "../api";
import { list, toPath } from "./helpers";
import type { NavItem } from "@/types";

interface ApiMenuItem {
  id: string;
  title: string;
  link: string;
  subLinks?: ApiMenuItem[];
}

function toNav(items: ApiMenuItem[]): NavItem[] {
  return items.map((i) => ({
    id: String(i.id),
    title: i.title,
    link: toPath(i.link),
    ...(i.subLinks?.length && { subLinks: toNav(i.subLinks) }),
  }));
}

export async function getMenuType(type: number): Promise<NavItem[]> {
  const group = list<{ type?: number | string; items?: ApiMenuItem[] }>(await fetchAPI<unknown>("menu")).find((g) => Number(g.type) === type);
  return toNav(group?.items ?? []);
}

const FACULTY_LINK = "/faculty-staff";

/** Makes sure Faculty & Staff sits under the About Us submenu even if the CMS menu doesn't list it yet. */
export async function getMainMenu(): Promise<NavItem[]> {
  const menu = await getMenuType(1);
  const has = (items: NavItem[]): boolean => items.some((i) => i.link === FACULTY_LINK || (i.subLinks ? has(i.subLinks) : false));
  if (has(menu)) return menu;
  return menu.map((m) =>
    m.link === "/about-us" && m.subLinks?.length
      ? { ...m, subLinks: [...m.subLinks, { id: "faculty-staff", title: "Faculty & Staff", link: FACULTY_LINK }] }
      : m,
  );
}

export async function getFooterMenu(): Promise<NavItem[]> {
  return getMenuType(2);
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export async function getSocial(): Promise<SocialLink[]> {
  const group = list<{ type?: number | string; items?: { title?: string; url?: string; icon?: string }[] }>(await fetchAPI<unknown>("social")).find(
    (g) => Number(g.type) === 1,
  );
  const links = (group?.items ?? []).flatMap((s) =>
    s.title && s.url ? [{ name: s.title, href: s.url, icon: (s.icon ?? "").replace(/\bfa-(solid|regular|brands)\b/g, "").trim() }] : [],
  );
  return links;
}
