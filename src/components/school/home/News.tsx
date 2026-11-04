import Image from "next/image";
import Link from "next/link";
import ApplyLink from "../ApplyLink";
import { getNews, getNotices } from "@/lib/cms";
import SectionHead from "./SectionHead";

const day = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", timeZone: "UTC" });
const month = (d: string) => new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export default async function News() {
  const [news, notice] = await Promise.all([getNews(), getNotices()]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead eyebrow="Latest" title="News & notices" href="/news" linkText="All news" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
          {news.map((n) => (
            // Detail pages aren't built yet — list page / external form for now.
            <li key={n.id}>
              <ApplyLink href={n.link ?? "/news"} className="group flex items-center gap-5 p-5 transition hover:bg-paper">
                <time dateTime={n.date} className="w-16 shrink-0 rounded-lg bg-maroon py-2 text-center text-paper">
                  <span className="block font-display text-2xl font-semibold leading-none">{day(n.date)}</span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider">{month(n.date)}</span>
                </time>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-maroon">{n.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/65">{n.excerpt}</p>
                </div>
                {n.image && (
                  <span className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-md sm:block">
                    <Image src={n.image} alt="" fill sizes="96px" className="object-cover object-top" />
                  </span>
                )}
                {n.pdf && <i className="fa-solid fa-file-pdf hidden text-2xl text-maroon sm:block" aria-label="PDF" role="img"></i>}
              </ApplyLink>
            </li>
          ))}
        </ul>

        {/* Pinned notice board */}
        <aside className="relative rotate-[0.8deg] self-start bg-note p-7 shadow-lg">
          <i className="fa-solid fa-thumbtack absolute -top-2 left-1/2 -translate-x-1/2 text-xl text-maroon" aria-hidden="true"></i>
          <h3 className="font-hand text-3xl leading-none text-maroon">Notice board</h3>
          {notice.map((n) => (
            <div key={n.title} className="mt-4 border-t border-dashed border-ink/25 pt-4">
              <time dateTime={n.date} className="text-xs font-bold uppercase tracking-wider text-ink/60">
                {day(n.date)} {month(n.date)}
              </time>
              <h4 className="mt-1 font-display text-lg font-semibold leading-snug">{n.title}</h4>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-ink/80">{n.text}</p>
            </div>
          ))}
          <Link href="/notice" className="mt-5 inline-block text-sm font-bold text-maroon hover:underline">
            See all notices <i className="fa-solid fa-arrow-right ml-1 text-xs" aria-hidden="true"></i>
          </Link>
        </aside>
      </div>
    </section>
  );
}
