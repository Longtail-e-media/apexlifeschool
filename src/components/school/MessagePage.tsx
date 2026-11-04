import Image from "next/image";
import type { Person } from "@/lib/cms";
import { Tape } from "./Doodles";
import PageHeader from "./PageHeader";
import Admission from "./home/Admission";

/** A leader's message laid out as a signed letter. */
export default function MessagePage({ person, heading }: { person: Person; heading: string }) {
  return (
    <>
      <PageHeader title={heading} eyebrow="A note from our leader" crumbs={[{ name: "The School", href: "/about-us" }, { name: heading }]} />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_2fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative mx-auto max-w-xs -rotate-2 rounded-sm bg-white p-3 pb-5 shadow-lg ring-1 ring-ink/10">
            <Tape />
            {person.photo ? (
              <Image src={person.photo} alt={person.name} width={543} height={336} className="h-auto w-full" />
            ) : (
              <div className="flex aspect-4/3 items-center justify-center bg-maroon font-display text-6xl text-paper" aria-hidden="true">
                {person.name.split(" ").map((w) => w[0]).join("")}
              </div>
            )}
            <p className="mt-4 font-hand text-3xl leading-none text-maroon">{person.name}</p>
            <p className="text-sm text-ink/60">{person.role}</p>
          </div>
        </aside>

        <article className="ruled rounded-sm bg-white p-7 shadow-md ring-1 ring-ink/10 sm:p-10">
          <div className="space-y-8 text-[16px] leading-8 text-ink/80">
            {person.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <p className="mt-10 font-hand text-4xl leading-none text-maroon">{person.name}</p>
          <p className="text-sm text-ink/60">{person.role}</p>
        </article>
      </section>

      <Admission />
      <div className="h-16 sm:h-20" />
    </>
  );
}
