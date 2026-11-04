import { getVideoUploads } from "@/lib/cms";
import { links } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Tape } from "@/components/school/Doodles";
import PageHeader from "@/components/school/PageHeader";

export const metadata = pageMeta({
  title: "Video Gallery",
  description: "Watch Apex Life School in motion: introduction and school-life videos from Chabahil, Kathmandu.",
  path: "/video-gallery",
});

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace(/^\/+/, "");
    return u.searchParams.get("v") || null;
  } catch {
    return null;
  }
}

export default async function VideoGalleryPage() {
  const videos = await getVideoUploads();

  return (
    <>
      <PageHeader
        title="Video gallery"
        eyebrow="Stories"
        crumbs={[{ name: "Stories" }, { name: "Video gallery" }]}
        intro="See the school the way children and families do: in motion."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <ul className="grid gap-10 md:grid-cols-2">
          {videos.map((v, i) => {
            const ytId = getYouTubeId(v.src);
            const desc = v.text || v.subTitle;

            return (
              <li key={v.id || v.src}>
                <figure
                  className={`relative rounded-sm bg-white p-3 pb-5 shadow-lg ring-1 ring-ink/10 ${
                    i % 2 ? "rotate-1" : "-rotate-1"
                  }`}
                >
                  <Tape />
                  {ytId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                      title={v.title}
                      className="aspect-video w-full bg-ink"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="aspect-video w-full bg-ink object-cover"
                      controls
                      preload="none"
                      playsInline
                      aria-label={v.title}
                    >
                      <source src={v.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <figcaption className="px-1 pt-4">
                    <h2 className="font-hand text-3xl leading-none text-maroon">
                      {v.title}
                    </h2>
                    {desc && <p className="mt-1 text-sm text-ink/70">{desc}</p>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>

        {links.youtube && (
          <p className="mt-14 text-center">
            <a
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-md border-2 border-maroon px-6 py-3 font-bold text-maroon hover:bg-maroon hover:text-paper cursor-pointer"
            >
              <i className="fa-brands fa-youtube text-lg" aria-hidden="true"></i> More on our YouTube channel
            </a>
          </p>
        )}
      </section>
    </>
  );
}
