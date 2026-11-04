import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNews } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { SITE_URL, site } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/school/PageHeader";

type Props = { params: Promise<{ slug: string }> };

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
// CMS images are absolute URLs; the extracted fallback content uses site-relative paths.
const absolute = (url: string) => (/^https?:\/\//i.test(url) ? url : `${SITE_URL}${url}`);

export async function generateStaticParams() {
  return (await getNews()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = (await getNews()).find((x) => x.slug === slug);
  if (!n) return {};
  return pageMeta({
    title: n.title,
    description: n.excerpt,
    path: `/news/${n.slug}`,
    image: n.image,
  });
}

export default async function NewsDetail({ params }: Props) {
  const { slug } = await params;
  const news = await getNews();
  const n = news.find((x) => x.slug === slug);
  if (!n) notFound();

  const { image, body, pdf, link } = n;
  const others = news.filter((x) => x.slug !== n.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: n.title,
    datePublished: n.date,
    description: n.excerpt,
    mainEntityOfPage: `${SITE_URL}/news/${n.slug}`,
    ...(image && { image: absolute(image) }),
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${SITE_URL}${site.logo}` } },
  };

  return (
    <>
      <JsonLd schema={schema} />
      <PageHeader title={n.title} eyebrow={fmt(n.date)} crumbs={[{ name: "News", href: "/news" }, { name: n.title }]} />

      <article className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[2fr_1fr]">
        <div>
          {image && (
            <div className="relative aspect-video overflow-hidden rounded-xl bg-blush">
              <Image src={image} alt={n.title} fill preload sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
            </div>
          )}
          <div className={`space-y-5 leading-8 text-ink/80 ${image ? "mt-8" : ""}`}>
            {(body ?? [n.excerpt]).map((p) => (
              <p key={p.slice(0, 50)}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {pdf && (
              <a href={pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-maroon px-5 py-2.5 text-sm font-bold text-paper hover:bg-maroon-deep">
                <i className="fa-solid fa-file-pdf" aria-hidden="true"></i> Download the notice (PDF)
              </a>
            )}
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-maroon px-5 py-2.5 text-sm font-bold text-paper hover:bg-maroon-deep">
                Open the admission form <i className="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>
              </a>
            )}
          </div>
        </div>

        <aside>
          <h2 className="font-hand text-3xl leading-none text-maroon">More news</h2>
          <ul className="mt-4 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/news/${o.slug}`} className="block p-4 hover:bg-paper">
                  <time dateTime={o.date} className="text-xs font-bold uppercase tracking-widest text-leaf-deep">{fmt(o.date)}</time>
                  <p className="mt-1 font-display font-semibold leading-snug hover:text-maroon">{o.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </article>
    </>
  );
}
