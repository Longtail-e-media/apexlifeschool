import Image from "next/image";
import Link from "next/link";
import { getLifeAtApex, getMessages } from "@/lib/cms";
import { Tape } from "../Doodles";
import TestimonialVideos from "../TestimonialVideos";
import SectionHead from "./SectionHead";

/** Messages as hand-signed letters, then the community portraits. */
export default async function Letters() {
  const [{ chairperson, principal }, lifeAtApex] = await Promise.all([getMessages(), getLifeAtApex()]);

  const letters = [
    chairperson && {
      who: chairperson,
      text: chairperson.paragraphs[0] ?? "",
      href: "/message-from-chairperson",
      tilt: "-rotate-[0.6deg]",
    },
    principal && {
      who: principal,
      // The fifth paragraph is the principal's invitation; use the last one if the letter is shorter.
      text: principal.paragraphs[4] ?? principal.paragraphs.at(-1) ?? "",
      href: "/message-from-principal",
      tilt: "rotate-[0.6deg]",
    },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="border-y border-ink/10 bg-mint/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {lifeAtApex && lifeAtApex.length > 0 && (
          <>
            <SectionHead
              eyebrow="From our community"
              title="Voices from our community"
            />
            <TestimonialVideos items={lifeAtApex} className="mt-8 mb-16" />
          </>
        )}

        <SectionHead
          eyebrow="From our leaders"
          title="Words for our families"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {letters.map(({ who, text, href, tilt }) => (
            <article
              key={who.name}
              className={`ruled relative bg-white p-7 shadow-md ring-1 ring-ink/10 ${tilt}`}
            >
              <Tape className="bg-leaf/30" />
              <p className="line-clamp-5 text-[15px] leading-8 text-ink/80">
                {text}
              </p>
              <div className="mt-5 flex items-center gap-4">
                {who.photo && (
                  <Image
                    src={who.photo}
                    alt={who.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover object-top ring-2 ring-white"
                  />
                )}
                <div className="flex-1">
                  <p className="font-hand text-3xl leading-none text-maroon">
                    {who.name}
                  </p>
                  <p className="text-sm text-ink/60">{who.role}</p>
                </div>
                <Link
                  href={href}
                  className="text-sm font-bold text-maroon hover:underline"
                >
                  Read full letter
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
