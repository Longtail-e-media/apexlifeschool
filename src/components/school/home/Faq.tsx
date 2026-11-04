import { getFaqs } from "@/lib/cms";
import JsonLd from "@/components/seo/JsonLd";
import SectionHead from "./SectionHead";

export default async function Faq() {
  const faqs = await getFaqs();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className="border-t border-ink/10 bg-white py-16 sm:py-20">
      <JsonLd schema={schema} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead eyebrow="Quick answers" title="Questions parents often ask" />
        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold">
                {f.q}
                <i className="fa-solid fa-plus text-xs text-maroon transition-transform group-open:rotate-45" aria-hidden="true"></i>
              </summary>
              <p className="mt-3 leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
