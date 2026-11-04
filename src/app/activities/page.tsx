import Image from "next/image";
import { getActivities } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { Tape } from "@/components/school/Doodles";
import PageHeader from "@/components/school/PageHeader";
import Admission from "@/components/school/home/Admission";

export const metadata = pageMeta({
  title: "Activities",
  description:
    "Football, basketball, music, dance, art, theatre, yoga and scouts: the clubs and activities that give every child at Apex Life School something to love.",
  path: "/activities",
});

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <>
      <PageHeader
        title="More to learn than what’s in the books"
        eyebrow="School life"
        crumbs={[{ name: "School Life" }]}
        intro="Sports, music, art, theatre and mindfulness are part of the school week, so every child can find something they love."
      />

      <section className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 sm:py-20">
        {activities.map((a, i) => (
          <article key={a.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <figure className={`relative rounded-sm bg-white p-3 shadow-lg ring-1 ring-ink/10 ${i % 2 ? "rotate-1 lg:order-2" : "-rotate-1"}`}>
              <Tape />
              <div className="relative aspect-4/3 overflow-hidden bg-leaf">
                {a.image ? (
                  <Image src={a.image} alt={a.title} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-paper" aria-hidden="true">
                    <i className="fa-solid fa-spa text-7xl"></i>
                  </span>
                )}
              </div>
            </figure>
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">{a.title}</h2>
              <p className="mt-4 leading-8 text-ink/75">{a.text}</p>
              {a.items.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {a.items.map((it) => (
                    <li key={it} className="rounded-full bg-maroon/10 px-3.5 py-1 text-sm font-bold text-maroon">{it}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </section>

      <Admission />
      <div className="h-16 sm:h-20" />
    </>
  );
}
