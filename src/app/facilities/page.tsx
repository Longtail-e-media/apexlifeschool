import Image from "next/image";
import { getFacilities } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { Tape } from "@/components/school/Doodles";
import PageHeader from "@/components/school/PageHeader";
import Admission from "@/components/school/home/Admission";

export const metadata = pageMeta({
  title: "Facilities",
  description:
    "Sports grounds, a science lab, a digital library, GPRS-tracked school buses, a dining hall and an infirmary: the spaces that make a school day work at Apex Life School, Chabahil.",
  path: "/facilities",
});

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <>
      <PageHeader
        title="Everything a school day needs"
        eyebrow="School life"
        crumbs={[{ name: "Facilities" }]}
        intro="From the school bus in the morning to the playing field after lessons, everything a child needs is in one place."
      />

      <section className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 sm:py-20">
        {facilities.map((f, i) => (
          <article key={f.title} id={f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <figure className={`relative rounded-sm bg-white p-3 shadow-lg ring-1 ring-ink/10 ${i % 2 ? "rotate-1 lg:order-2" : "-rotate-1"}`}>
              <Tape />
              <div className="relative aspect-4/3 overflow-hidden">
                {f.image ? (
                  <Image src={f.image} alt={f.title} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center bg-leaf text-paper" aria-hidden="true">
                    <i className="fa-solid fa-school text-7xl"></i>
                  </span>
                )}
              </div>
            </figure>
            <div>
              <p className="font-hand text-2xl leading-none text-maroon">0{i + 1}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{f.title}</h2>
              <p className="mt-4 leading-8 text-ink/75">{f.text}</p>
            </div>
          </article>
        ))}
      </section>

      <Admission />
      <div className="h-16 sm:h-20" />
    </>
  );
}
