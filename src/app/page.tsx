import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getSlideshowVideo } from "@/lib/cms";
import Hero from "@/components/school/home/Hero";
import About from "@/components/school/home/About";
import Glance from "@/components/school/home/Glance";
import FacilitiesPreview from "@/components/school/home/FacilitiesPreview";
import Activities from "@/components/school/home/Activities";
import Letters from "@/components/school/home/Letters";
import News from "@/components/school/home/News";
import Admission from "@/components/school/home/Admission";
import AppPromo from "@/components/school/home/AppPromo";
import Faq from "@/components/school/home/Faq";
import Nearby from "@/components/school/home/Nearby";
import Video from "@/components/school/home/Video";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline} | Chabahil, Kathmandu` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: "/",
  },
};

export default async function Home() {
  const videoSrc = await getSlideshowVideo().catch(() => undefined);

  // Order = a parent's journey, following the main menu:
  // who we are -> proof -> school life -> facilities -> people -> news -> app -> questions -> where we are -> apply.
  // Section backgrounds alternate cream / white / mint down the page.
  return (
    <>
      <Video src={videoSrc} />
      {/* <Hero /> */}
      <About />
      <Glance />
      <Activities />
      <FacilitiesPreview />
      <Letters />
      <News />
      <AppPromo />
      <Faq />
      <Nearby />
      <Admission />
      <div className="h-16 sm:h-20" />
    </>
  );
}
