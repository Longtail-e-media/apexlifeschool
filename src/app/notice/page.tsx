import Link from "next/link";
import { getNews, getNotices } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/school/PageHeader";

export const metadata = pageMeta({
  title: "Notices",
  description: "Official notices for students and parents of Apex Life School, Chabahil, Kathmandu.",
  path: "/notice",
});

const fmt = (d: string) => {
  const parsed = new Date(d);
  return isNaN(parsed.getTime())
    ? d
    : parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};

export default async function NoticePage() {
  const [notice, news] = await Promise.all([getNotices(), getNews()]);

  // Notices plus the news items that are really notices (they carry a PDF).
  const all = [
    ...notice.map((n) => ({
      key: `notice-${n.id || n.title}`,
      date: n.date,
      title: n.title,
      text: n.text,
      download: n.download,
      href: undefined as string | undefined,
    })),
    ...news
      .filter((n) => n.pdf)
      .map((n) => ({
        key: `news-${n.slug}`,
        date: n.date,
        title: n.title,
        text: n.excerpt,
        download: n.pdf,
        href: `/news/${n.slug}` as string | undefined,
      })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title="Notice board" eyebrow="For students & parents" crumbs={[{ name: "Notices" }]} />

      <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 sm:py-20">
        {all.map((n, i) => (
          <article key={n.key} className={`relative bg-note p-7 shadow-md ${i % 2 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}`}>
            <i className="fa-solid fa-thumbtack absolute -top-2 left-8 text-maroon" aria-hidden="true"></i>
            <time dateTime={n.date} className="text-xs font-bold uppercase tracking-widest text-ink/60">{fmt(n.date)}</time>
            <h2 className="mt-1 font-display text-xl font-semibold leading-snug">{n.title}</h2>
            <p className="mt-3 leading-7 text-ink/80">{n.text}</p>
            {n.download && (
              <a
                href={n.download}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-maroon hover:underline mr-4"
              >
                <i className="fa-solid fa-file-arrow-down text-xs" aria-hidden="true"></i> Download attachment
              </a>
            )}
            {n.href && (
              <Link href={n.href} className="mt-4 inline-block text-sm font-bold text-maroon hover:underline">
                Read the full notice <i className="fa-solid fa-arrow-right ml-1 text-xs" aria-hidden="true"></i>
              </Link>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
