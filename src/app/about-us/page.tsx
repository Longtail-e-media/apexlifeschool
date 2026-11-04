import { getAbout, getHistory } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { Tape } from "@/components/school/Doodles";
import PageHeader from "@/components/school/PageHeader";
import Glance from "@/components/school/home/Glance";
import Admission from "@/components/school/home/Admission";

export const metadata = pageMeta({
  title: "About Us",
  description:
    "The story of Apex Life School in Chabahil, Kathmandu: from Sishu Nitekan School in 2040 BS to a school of small classes, strong facilities and caring teachers.",
  path: "/about-us",
});

export default async function AboutPage() {
  const [about, history] = await Promise.all([getAbout(), getHistory()]);

  return (
    <>
      <PageHeader
        title="Our story"
        eyebrow="About Apex"
        crumbs={[{ name: "The School", href: "/about-us" }, { name: "About School" }]}
        intro="More than four decades in Chabahil, and still finding better ways to help children grow."
      />

      <section className="mx-auto grid max-w-7xl items-start gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">How it began</h2>
          <p className="mt-4 leading-8 text-ink/75">{about.summary}</p>
        </div>
        <div className="relative -rotate-1 rounded-sm bg-white p-3 shadow-xl ring-1 ring-ink/10">
          <Tape />
          <video className="aspect-video w-full bg-ink object-cover" controls preload="metadata" playsInline aria-label="Apex Life School introduction video">
            <source src={about.videos[1]} type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 sm:px-6 sm:pb-20 md:grid-cols-2">
        <article className="relative -rotate-1 bg-note p-7 shadow-md">
          <i className="fa-solid fa-thumbtack absolute -top-2 left-6 text-maroon" aria-hidden="true"></i>
          <h2 className="font-hand text-3xl leading-none text-maroon">Our mission</h2>
          <p className="mt-3 leading-7 text-ink/80">{about.mission}</p>
        </article>
        <article className="relative rotate-1 bg-mint p-7 shadow-md">
          <i className="fa-solid fa-thumbtack absolute -top-2 left-6 text-leaf-deep" aria-hidden="true"></i>
          <h2 className="font-hand text-3xl leading-none text-leaf-deep">Our vision</h2>
          <p className="mt-3 leading-7 text-ink/80">{about.vision}</p>
        </article>
      </section>

      {/* Milestones are the CMS articles slugged "milestone-N" (year = article subtitle). The old site's timeline years contradicted the 2040 BS founding, so they were dropped. */}
      <section className="border-y border-ink/10 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="font-hand text-2xl leading-none text-maroon">Milestones</p>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Moments that shaped us</h2>
          <ol className="mt-10 space-y-0 border-l-2 border-dashed border-maroon/30 pl-8">
            {history.map((h, i) => (
              <li key={h.title} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[2.85rem] flex h-8 w-8 items-center justify-center rounded-full bg-sun font-display text-sm font-bold" aria-hidden="true">
                  {i + 1}
                </span>
                {h.year && <p className="text-xs font-bold uppercase tracking-widest text-maroon">{h.year}</p>}
                <h3 className="font-display text-xl font-semibold">{h.title}</h3>
                <p className="mt-1 leading-7 text-ink/70">{h.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Glance />
      <div className="h-16 sm:h-20" />
      <Admission />
      <div className="h-16 sm:h-20" />
    </>
  );
}
