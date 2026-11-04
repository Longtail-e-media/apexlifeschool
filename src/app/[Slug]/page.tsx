import { getArticles } from "@/lib/cms";
import { toParagraphs } from "@/lib/cms/helpers";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/school/PageHeader";
import { SITE_URL, site } from "@/lib/site";

interface PageProps {
  params: Promise<{ Slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { Slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === Slug);

  if (!article) return { title: "Page Not Found" };

  const title = article.meta_title?.trim() || article.title || Slug;
  const description =
    article.meta_description?.trim() ||
    toParagraphs(article.content ?? "").slice(0, 2).join(" ").slice(0, 160);
  const image = article.gallery_images?.[0]?.src || "";

  return pageMeta({
    title,
    description,
    path: `/${Slug}`,
    ...(image ? { image } : {}),
  });
}

export default async function SlugPage({ params }: PageProps) {
  const { Slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === Slug);

  if (!article) notFound();

  const title = article.title || Slug;
  const subtitle = article.subtitle?.trim() || "";
  const content = article.content ?? "";
  const image = article.gallery_images?.[0]?.src || "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: toParagraphs(content).slice(0, 1).join(" "),
    url: `${SITE_URL}/${Slug}`,
    ...(image ? { image: [image] } : {}),
    author: {
      "@type": "Organization",
      name: site.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: site.name,
      url: SITE_URL,
    },
  };

  return (
    <>
      <JsonLd schema={articleSchema} />
      <PageHeader
        title={title}
        eyebrow={subtitle || "Apex Life School"}
        crumbs={[{ name: "Home", href: "/" }, { name: title }]}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        {image && (
          <div className="mb-12 overflow-hidden rounded-md shadow-lg ring-1 ring-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none leading-relaxed text-ink/80 [&_h2]:font-display [&_h2]:text-maroon [&_h3]:font-display [&_h3]:text-maroon [&_a]:text-maroon [&_a]:underline [&_a:hover]:text-maroon-deep"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>
    </>
  );
}