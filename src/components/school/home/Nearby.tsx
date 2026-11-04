import { coordinates } from "@/lib/site";
import { getNearby } from "@/lib/cms";
import NearbyExplorer from "./NearbyExplorer";
import SectionHead from "./SectionHead";

/** "Nearby us": landmarks around the school, so families can place it on the map. Contact details live in the footer. */
export default async function Nearby() {
  const nearby = await getNearby();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead eyebrow="Nearby us" title="Easy to find, close to Boudha and Chabahil" />
      <NearbyExplorer places={nearby} school={coordinates} />
    </section>
  );
}
