import Link from "next/link";
import ApplyLink from "../ApplyLink";
import { getSlideshow } from "@/lib/cms";
import { links } from "@/lib/site";
import { Squiggle } from "../Doodles";
import HeroSlider from "./HeroSlider";

const facts = [
  { icon: "fa-people-group", text: "1:9 teacher–student ratio" },
  { icon: "fa-bus", text: "GPRS-tracked school buses" },
  { icon: "fa-flask", text: "Science lab & digital library" },
];

export default async function Hero() {
  const slides = await getSlideshow();

  return (
    <section className="ruled border-b border-ink/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:py-16">
        <div className="min-w-0">
          <ApplyLink
            href={links.admissionForm}
            className="inline-block -rotate-2 rounded-md bg-sun px-4 py-1 font-hand text-2xl leading-tight text-ink shadow-sm transition hover:rotate-0"
          >
            Admissions open for 2083!
          </ApplyLink>

          <h1 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.15]">
            Where every child is{" "}
            <span className="relative inline-block text-maroon">
              known
              <Squiggle className="absolute inset-x-0 -bottom-2" />
            </span>{" "}
            by name.
          </h1>

          <p className="mt-5 max-w-lg leading-7 text-ink/75">
            Apex Life School is a warm, well-equipped school in Chabahil, Kathmandu. With one teacher for every nine students, your child gets the attention to settle in, speak up and thrive.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ApplyLink
              href={links.admissionForm}
              className="rounded-md bg-maroon px-6 py-3 font-bold text-paper transition hover:bg-maroon-deep"
            >
              Start admission
            </ApplyLink>
            <Link
              href="/contact-us"
              className="rounded-md border-2 border-maroon px-6 py-2.5 font-bold text-maroon transition hover:bg-maroon hover:text-paper"
            >
              Visit our school
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-ink/75">
            {facts.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                <i className={`fa-solid ${f.icon} text-leaf`} aria-hidden="true"></i>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <HeroSlider slides={slides} />
      </div>
    </section>
  );
}
