import Image from "next/image";
import { getFacilities } from "@/lib/cms";
import { Tape } from "../Doodles";
import SectionHead from "./SectionHead";

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.8deg]", "-rotate-[1.2deg]", "rotate-[0.5deg]"];

/** First sentence of a description (two when the first is very short). */
function lead(text: string) {
  const parts = text.split(/(?<=\.)\s+/);
  return parts[0].length < 70 && parts[1] ? `${parts[0]} ${parts[1]}` : parts[0];
}

export default async function FacilitiesPreview() {
  const facilities = await getFacilities();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="Around the school" title="Spaces that help children thrive" href="/facilities" linkText="See all facilities" />

        <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f, i) => (
            <li key={f.title}>
              <figure className={`relative rounded-sm bg-paper p-3 pb-5 shadow-md ring-1 ring-ink/10 transition hover:rotate-0 hover:shadow-xl ${tilts[i % tilts.length]}`}>
                <Tape className={i % 2 ? "rotate-2" : ""} />
                <div className="relative aspect-4/3 overflow-hidden">
                  {f.image ? (
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center bg-leaf text-paper" aria-hidden="true">
                      <i className="fa-solid fa-school text-6xl"></i>
                    </span>
                  )}
                </div>
                <figcaption className="px-1 pt-4">
                  <h3 className="font-hand text-3xl leading-none text-maroon">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/75">{lead(f.text)}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
