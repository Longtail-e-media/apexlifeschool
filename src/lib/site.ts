import type { NavItem } from "@/types";
import albums from "./apex-gallery.json";
import { getSocial } from "./cms";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://apexlifeschool.edu.np";

export const brand = {
  logo: "/apex/brand/logo.png",
  hero: "/apex/brand/heroImage.jpeg",
  director: "/apex/brand/director.png",
  principal: "/apex/brand/principal.png",
};


  const social = await getSocial();

  
  
  
  export const links = {
  facebook: social.find((s) => s.name === "facebook")?.href,
  youtube: social.find((s) => s.name === "youtube")?.href,
  x: social.find((s) => s.name === "x")?.href,
  admissionForm: "https://www.ingrails.com/school/admission/form/apex-life-school",
  eDigitalApply: "https://edigitalnepal.com/g/apply/apex",
  prospectus: "/apex/docs/RHQSn1dsToQ7Br78-1742204737.pdf",
  playStore: "https://play.google.com/store/apps/details?id=com.edigitalnepal.apex&hl=en",
  appStore: "https://apps.apple.com/us/app/apex-life-school/id1614213522",
  playStoreBadge: "/apex/icons/DrsFWXwDQco5x3oK-1741064037.png",
  appStoreBadge: "/apex/icons/TbM1IW2BQxGdpWys-1741064037.png",
  appPromo: "/apex/gallery/SBWs5uKVfbPvpr6l-1742188770.png",
  playStoreQr: "/apex/icons/googleplay.png",
  appStoreQr: "/apex/icons/applestore.png",
};

export const contact = {
  address: null as string | null,
  plusCode: null as string | null,
  phones: [] as string[],
  email: null as string | null,
  hours: 'Sun – Fri: 8:15 AM – 4:30 PM, Saturday: Closed',
};

export const coordinates = { lat: 27.72663, lng: 85.3556348 };

export const glance = [
  { value: "40+", label: "Years of schooling", icon: "fa-calendar-check" },
  { value: "1:9", label: "Teacher–student ratio", icon: "fa-chalkboard-user" },
  { value: null as string | null, label: "ICA & CRE clubs to join", icon: "fa-people-group" },
  { value: null as string | null, label: "Languages of instruction", icon: "fa-language" },
  { value: null as string | null, label: "International recognitions", icon: "fa-award" },
];

export const recognitions = [
  "/apex/gallery/iuKycRXvAWcqXBTN-1765264138.jpg",
  "/apex/gallery/IK6oY2LQNCUh5Hww-1741581341.png",
  "/apex/gallery/6rff4reHlxv37wsc-1741581341.jpeg",
];


export const events: { title: string; date: string; text: string }[] = [];

export const galleryAlbums: { id: string; title: string; cover: string | null; images: string[] }[] = albums;

export const site = {
  name: "Apex Life School",
  tagline: "Schooling For Life",
  description:
    "Apex Life School in Chabahil, Kathmandu: a warm, well-equipped school with small classes (1:9), a science lab, digital library, sports grounds and GPRS-tracked buses. Admissions are open for 2083.",
  address: null as string | null,
  phones: [] as string[],
  email: null as string | null,
  hours: null as string | null,
  mapUrl: null as string | null,
  logo: brand.logo,
};
