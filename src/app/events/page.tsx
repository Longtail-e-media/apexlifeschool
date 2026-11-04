import Link from "next/link";
import { getEvents } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/school/PageHeader";

export const metadata = pageMeta({
  title: "Events",
  description: "Upcoming events and programmes at Apex Life School, Chabahil, Kathmandu.",
  path: "/events",
});

const fmt = (d: string) => {
  const parsed = new Date(d);
  return isNaN(parsed.getTime())
    ? d
    : parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHeader title="Events" eyebrow="Life at Apex" crumbs={[{ name: "Events" }]} intro="Programmes and celebrations at school." />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        {events && events.length > 0 ? (
          <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
            {events.map((e) => (
              <li key={e.id || e.title} className="p-6">
                <time dateTime={e.date} className="text-xs font-bold uppercase tracking-widest text-leaf-deep">{fmt(e.date)}</time>
                <h2 className="mt-1 font-display text-xl font-semibold">{e.title}</h2>
                <p className="mt-2 text-ink/70">{e.text}</p>
                {e.download && (
                  <a
                    href={e.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-maroon hover:underline"
                  >
                    <i className="fa-solid fa-file-arrow-down text-xs" aria-hidden="true"></i> Download attachment
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-white p-10 text-center">
            <i className="fa-regular fa-calendar text-4xl text-maroon" aria-hidden="true"></i>
            <h2 className="mt-4 font-display text-2xl font-semibold">No events are listed right now</h2>
            <p className="mx-auto mt-2 max-w-md text-ink/70">
              New programmes are announced through our notices and news. Please check back soon.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/notice" className="rounded-md bg-maroon px-5 py-2.5 text-sm font-bold text-paper hover:bg-maroon-deep">Latest notices</Link>
              <Link href="/news" className="rounded-md border-2 border-maroon px-5 py-2 text-sm font-bold text-maroon hover:bg-maroon hover:text-paper">School news</Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
