import ApplyLink from "../ApplyLink";
import { links } from "@/lib/site";

export default function Admission() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid items-center gap-8 rounded-2xl bg-maroon px-7 py-10 text-paper sm:px-12 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="font-hand text-2xl leading-none text-sun">Admissions 2083</p>
          <h2 className="mt-1 font-display text-2xl font-semibold leading-snug sm:text-3xl">Ready to join the Apex family?</h2>
          <p className="mt-3 max-w-xl leading-7 text-paper/85">
            Not sure about the process, the right grade or an age group? Send us your details or call the school office, and we’ll gladly walk you through it.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <ApplyLink
            href={links.admissionForm}
            className="rounded-md bg-sun px-6 py-3 text-center font-bold text-ink transition hover:brightness-105"
          >
            Start your application
          </ApplyLink>
          <a
            href={links.prospectus}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border-2 border-paper/50 px-6 py-2.5 text-center font-bold transition hover:bg-paper/10"
          >
            Download the prospectus
          </a>
        </div>
      </div>
    </section>
  );
}
