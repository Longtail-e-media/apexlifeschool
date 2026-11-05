import Link from "next/link";
import { getAbout } from "@/lib/cms";
import { Tape } from "../Doodles";

export default async function About() {
  const about = await getAbout();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative -rotate-1 rounded-sm bg-white p-3 shadow-xl ring-1 ring-ink/10">
          <Tape />
          <video
            className="aspect-video w-full bg-ink object-cover"
            controls
            preload="metadata"
            playsInline
            aria-label="Apex Life School introduction video"
          >
            <source src={about.videos[1]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div>
          <p className="font-hand text-5xl leading-none text-maroon">About us</p>
          <h2 className="mt-1 font-display text-2xl font-semibold leading-snug sm:text-3xl">A school with a story, and room to grow</h2>
          <p className="mt-4 leading-7 text-ink/75">{about.summary}</p>
          <Link href="/about-us" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-maroon hover:gap-3">
            Read our story <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
          </Link>
        </div>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <article className="relative -rotate-1 bg-note p-7 shadow-md">
          <i className="fa-solid fa-thumbtack absolute -top-2 left-6 text-maroon" aria-hidden="true"></i>
          <h3 className="font-hand text-3xl leading-none text-maroon">Our mission</h3>
          <p className="mt-3 text-sm leading-6 text-ink/80">{about.mission}</p>
        </article>
        <article className="relative rotate-1 bg-mint p-7 shadow-md">
          <i className="fa-solid fa-thumbtack absolute -top-2 left-6 text-leaf-deep" aria-hidden="true"></i>
          <h3 className="font-hand text-3xl leading-none text-leaf-deep">Our vision</h3>
          <p className="mt-3 text-sm leading-6 text-ink/80">{about.vision}</p>
        </article>
      </div>
    </section>
  );
}
