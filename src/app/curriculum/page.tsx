import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/school/PageHeader";
import Admission from "@/components/school/home/Admission";
import {
  getCurriculumMethods,
  getCurriculumSupports,
  getCurriculumSubject,
  getCurriculumStages,
  getPreparingForSee,
} from "@/lib/cms";

export const metadata = pageMeta({
  title: "Curriculum",
  description:
    "Apex Life School follows the national government curriculum, enriched with project-based learning, ICT and co-curricular activities. Labs, smart classes, a library, tours and outreach support every lesson.",
  path: "/curriculum",
});

export default async function CurriculumPage() {
  const [stages, methods, supports, seeSubjects, seePrep] = await Promise.all([
    getCurriculumStages(),
    getCurriculumMethods(),
    getCurriculumSupports(),
    getCurriculumSubject(),
    getPreparingForSee(),
  ]);

  return (
    <>
      <PageHeader
        title="The national curriculum, taught the Apex way"
        eyebrow="Curriculum"
        crumbs={[{ name: "Curriculum" }]}
        intro="We follow the government curriculum in every grade and add projects, technology and co-curricular activities, so children learn more deeply and enjoy it more."
      />

      {stages && stages.length > 0 && (
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          {stages.map((s) => (
            <article key={s.id} className="rounded-xl border border-ink/10 bg-white p-7 sm:p-9">
              {s.grades && (
                <p className="inline-block rounded-full bg-sun px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  {s.grades}
                </p>
              )}
              <h2 className="mt-4 font-display text-2xl font-semibold leading-snug">{s.title}</h2>
              {s.intro && <p className="mt-3 leading-7 text-ink/70">{s.intro}</p>}
              {s.points.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm leading-6 text-ink/80">
                      <i className="fa-solid fa-circle-check mt-1 text-leaf-deep" aria-hidden="true"></i>
                      {p}
                    </li>
                  ))}
                </ul>
              ) : s.content ? (
                <div dangerouslySetInnerHTML={{ __html: s.content }} className="mt-5 space-y-3 text-sm leading-6 text-ink/80" />
              ) : null}
            </article>
          ))}
        </section>
      )}

      <section className="border-y border-ink/10 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {methods && methods.length > 0 && (
            <>
              <p className="font-hand text-2xl leading-none text-maroon">How we teach</p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Teaching and learning methods</h2>

              <ul className="mt-10 grid gap-6 md:grid-cols-3">
                {methods.map((m) => (
                  <li key={m.id} className="rounded-xl bg-paper p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-lg text-leaf-deep" aria-hidden="true">
                      {m.icon ? <i className={m.icon}></i> : null}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold">{m.name}</h3>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {supports && supports.length > 0 && (
              <div>
                <h3 className="font-hand text-3xl leading-none text-maroon">To support learning, we use</h3>
                <ul className="mt-6 space-y-4">
                  {supports.map((s) => (
                    <li key={s.id} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint text-leaf-deep" aria-hidden="true">
                        {s.icon ? <i className={`${s.icon} text-sm`}></i> : null}
                      </span>
                      <span className="leading-7 text-ink/80">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {seeSubjects && seeSubjects.length > 0 && (
              <div className="relative -rotate-1 self-start bg-note p-7 shadow-md">
                <i className="fa-solid fa-thumbtack absolute -top-2 left-6 text-maroon" aria-hidden="true"></i>
                <h3 className="font-hand text-3xl leading-none text-maroon">
                  {seePrep?.title || "Preparing for the SEE"}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/80">
                  {seePrep?.intro ||
                    "Before the board exam, Grade X students sit a Boost-Up exam, with special remedial classes during the exam period. The SEE subjects are:"}
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {seeSubjects.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 text-sm font-semibold">
                      <i className="fa-solid fa-check text-xs text-leaf-deep" aria-hidden="true"></i>
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Want details for a particular grade?</h2>
        <p className="mt-3 text-ink/70">Our office will gladly share subjects, books and timetables for the grade your child is joining.</p>
        <Link href="/contact-us" className="mt-6 inline-block rounded-md bg-maroon px-6 py-3 font-bold text-paper hover:bg-maroon-deep">
          Ask the school office
        </Link>
      </section>

      <Admission />
      <div className="h-16 sm:h-20" />
    </>
  );
}
