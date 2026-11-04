import Image from "next/image";
import Link from "next/link";
import { getNews } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/school/PageHeader";

export const metadata = pageMeta({
  title: "News",
  description: "News from Apex Life School, Chabahil: admissions, exam notices, trips and life at school.",
  path: "/news",
});

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <PageHeader title="School news" eyebrow="Latest" crumbs={[{ name: "News" }]} intro="Announcements, trips and stories from around the school." />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <li key={n.id} className="group overflow-hidden rounded-xl border border-ink/10 bg-white transition hover:shadow-lg">
              <Link href={`/news/${n.slug}`} className="block">
                <div className="relative aspect-3/2 bg-blush">
                  {n.image ? (
                    <Image src={n.image} alt="" fill sizes="(min-width: 1024px) 368px, (min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-maroon" aria-hidden="true">
                      <i className="fa-solid fa-file-pdf text-5xl"></i>
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <time dateTime={n.date} className="text-xs font-bold uppercase tracking-widest text-leaf-deep">{fmt(n.date)}</time>
                  <h2 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:text-maroon">{n.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/70">{n.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
