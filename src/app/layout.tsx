import type { Metadata } from "next";
import { Nunito_Sans, Source_Serif_4, Caveat } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/school/SiteHeader";
import SiteFooter from "@/components/school/SiteFooter";
import { SITE_URL, site, links } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import SiteScripts from "@/components/seo/SiteScripts";
import PopupWrapper from "@/components/popup/PopupWrapper";

const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} | ${site.tagline} — Chabahil, Kathmandu`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_NP",
    images: [{ url: "/apex/brand/heroImage.jpeg", width: 2000, height: 1333, alt: "Apex Life School students" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const schoolSchema = {
  "@context": "https://schema.org",
  "@type": ["School", "EducationalOrganization"],
  name: site.name,
  slogan: site.tagline,
  url: SITE_URL,
  description: site.description,
  ...(site.email ? { email: site.email } : {}),
  ...(site.phones && site.phones.length > 0 ? { telephone: site.phones } : {}),
  logo: `${SITE_URL}${site.logo}`,
  image: `${SITE_URL}/apex/brand/heroImage.jpeg`,
  foundingDate: "1983",
  sameAs: [links.facebook, links.youtube, links.x].filter((url): url is string => Boolean(url)),
  address: {
    "@type": "PostalAddress",
    streetAddress: "KMC-06, Saraswotinagar, Chabahil",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:15",
    closes: "16:30",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-full" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <JsonLd schema={schoolSchema} />
      </head>
      <body
        className={`${nunito.variable} ${sourceSerif.variable} ${caveat.variable} font-body bg-paper text-ink selection:bg-sun selection:text-ink min-h-full flex flex-col`}
      >
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {/* Promotional popup — data fetched server-side, rendered once per session */}
        <PopupWrapper />
        {/* Analytics: GA4 + FB Pixel — injected only when real IDs exist in CMS */}
        <SiteScripts />
      </body>
    </html>
  );
}
