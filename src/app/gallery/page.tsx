import { getGallery } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import GalleryView from "@/components/school/GalleryView";
import PageHeader from "@/components/school/PageHeader";

export const metadata = pageMeta({
  title: "Gallery",
  description: "Photo gallery of Apex Life School, Chabahil — academics, activities and moments beyond the textbook.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageHeader title="Photo gallery" eyebrow="Moments" crumbs={[{ name: "Stories" }, { name: "Photo Gallery" }]} intro="Pick an album, tap a photo to see it full size." />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <GalleryView items={items} />
      </section>
    </>
  );
}
