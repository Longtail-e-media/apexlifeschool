import { fetchAPI } from "../api";

export interface ApiSiteRegulars {
  sitetitle?: string;
  sitename?: string;
  copyright?: string;
  fav_icon?: string;
  logo_upload?: string;
  footer_logo_upload?: string;
  fiscal_address?: string;
  landline_info?: string;
  email_address?: string;
  link?: string;
  location_map?: string;
  brief?: string;
}

export interface SiteRegulars {
  siteTitle: string | null;
  siteName: string | null;
  copyright: string | null;
  address: string | null;
  phones: string[];
  email: string | null;
  mapUrl: string | null;
  locationMapEmbed: string | null;
  brief: string | null;
  logo: string | null;
  footerLogo: string | null;
  hours: string | null;
}

export async function getSiteRegulars(): Promise<SiteRegulars | null> {
  const data = await fetchAPI<ApiSiteRegulars>("siteregulars");
  if (!data) return null;

  const phones = (data.landline_info ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    siteTitle: data.sitetitle?.trim() || null,
    siteName: data.sitename?.trim() || null,
    copyright: data.copyright?.trim() || null,
    address: data.fiscal_address?.trim() || null,
    phones,
    email: data.email_address?.trim() || null,
    mapUrl: data.link?.trim() || null,
    locationMapEmbed: data.location_map?.trim() || null,
    brief: data.brief?.trim() || null,
    logo: data.logo_upload?.trim() || null,
    footerLogo: data.footer_logo_upload?.trim() || null,
    hours: "Mon – Fri: 8:15 AM – 4:30 PM, Saturday & Sunday Closed",
  };
}
