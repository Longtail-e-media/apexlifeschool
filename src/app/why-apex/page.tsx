import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/school/PageHeader";
import Glance from "@/components/school/home/Glance";
import Admission from "@/components/school/home/Admission";
import { getWhyApexReasons } from "@/lib/cms/features";

export const metadata = pageMeta({
  title: "Why Apex?",
  description:
    "Why families choose Apex Life School in Chabahil, Kathmandu: small classes (1:9), caring and well-trained teachers, labs and smart classes, GPRS-tracked school buses, life-skill and co-curricular programmes, and over four decades of experience.",
  path: "/why-apex",
});

// "Apex Life Practices" — from the school's flyer. A/B/C map to the flyer's "Mind, Body and Soul" premises.
const pillars = [
  { icon: "fa-brain", tag: "Mind", title: "Reasoning and cognitive skills", text: "Our teaching develops curious minds and pushes students to be independent and to find solutions to any problem they meet. Our Life Skill Programs teach them to think outside the box, build positive behaviour, and grow in self-confidence and responsibility." },
  { icon: "fa-person-running", tag: "Body", title: "Physical skills", text: "This is where we train the body, so that students can face any challenge and meet it with ease." },
  { icon: "fa-hands-praying", tag: "Soul", title: "Moral and cultural education", text: "We teach our cultural and moral values, because they help students thrive in the modern world." },
];

const outcomes = [
  "Understand themselves as individuals and as part of groups, at school and beyond",
  "Show empathy in everyday situations and beliefs",
  "Deepen their sense of wonder about the world around them",
  "Build confidence through tasks such as presentations and debates",
  "Appreciate the value-based Sanskrit hymns taught at school",
];

export default async function WhyApexPage() {
  const reasons = await getWhyApexReasons();

  return (
    <>
      <PageHeader
        title="Why families choose Apex"
        eyebrow="Why Apex?"
        crumbs={[{ name: "The School", href: "/about-us" }, { name: "Why Apex?" }]}
        intro="Small classes, caring teachers, real labs, safe journeys, and a school that has been part of Chabahil since 1983."
      />

      {reasons && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <li key={r.id} className="rounded-xl border border-ink/10 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-lg text-leaf-deep" aria-hidden="true">
                  {r.icon ? <i className={r.icon}></i> : null}
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold leading-snug">{r.name}</h2>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-y border-ink/10 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
            <div>
              <p className="font-hand text-2xl leading-none text-maroon">Apex Life Practices</p>
              <h2 className="mt-1 font-display text-2xl font-semibold leading-snug sm:text-3xl">Nurturing mind, body and soul</h2>
            </div>
            <div className="space-y-4 leading-8 text-ink/75">
              <p>
                The learning environment a school provides shapes the future of our community and our nation, and a child's spirit is nurtured by an inspiring school.
              </p>
              <p>
                At Apex, co-curricular and extra-curricular activities reflect our caring ethos and our belief in the holistic development of every student. They nourish the inner spirit and make learning fun. We are committed to student participation, and we believe in learning by doing.
              </p>
            </div>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <li key={p.tag} className="rounded-xl border border-ink/10 bg-paper p-7">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-lg text-leaf-deep" aria-hidden="true">
                    <i className={`fa-solid ${p.icon}`}></i>
                  </span>
                  <span className="font-hand text-3xl leading-none text-maroon">{p.tag}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{p.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-ink/10 bg-paper p-7">
              <h3 className="font-display text-xl font-semibold leading-snug">In a caring, supportive environment, children learn to:</h3>
              <ul className="mt-5 space-y-3">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm leading-6 text-ink/80">
                    <i className="fa-solid fa-circle-check mt-1 text-leaf-deep" aria-hidden="true"></i>
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative -rotate-1 bg-note p-7 shadow-md">
              <i className="fa-solid fa-thumbtack absolute -top-2 left-6 text-maroon" aria-hidden="true"></i>
              <h3 className="font-hand text-3xl leading-none text-maroon">Mind, body and soul</h3>
              <p className="mt-3 leading-7 text-ink/80">
                These are the three fundamental premises of our school. The balance of Life Skill Programs, physical training and moral education helps children grow into capable, confident and caring people.
              </p>
              <Link href="/activities" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-maroon hover:gap-3">
                See clubs and activities <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Glance tone="paper" />
      <div className="h-16 sm:h-20" />
      <Admission />
      <div className="h-16 sm:h-20" />
    </>
  );
}
