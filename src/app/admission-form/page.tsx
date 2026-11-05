import type { Metadata } from "next";
import Link from "next/link";
import { links } from "@/lib/site";
import { getSiteRegulars } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import AdmissionForm from "@/components/school/AdmissionForm";
import PageHeader from "@/components/school/PageHeader";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Admission Inquiry Form 2083",
    description:
      "Apply to Apex Life School, Chabahil, Kathmandu. Fill in the admission inquiry form — child’s details, interested grade and parent’s contact — and our team will get in touch with you shortly.",
    path: "/admission-form",
  }),
};

const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

export default async function AdmissionFormPage() {
  const regulars = await getSiteRegulars();
  const phones = regulars?.phones ?? [];
  const hours = regulars?.hours ?? null;

  // The reCAPTCHA widget is shown only when the server can verify it (secret + site key configured).
  const captcha = Boolean(process.env.RECAPTCHA_SECRET_KEY && process.env.RECAPTCHA_SITE_KEY);

  return (
    <>
      <PageHeader
        title="Admission inquiry form"
        eyebrow="Apply online"
        crumbs={[{ name: "Admissions", href: "/admissions" }, { name: "Admission form" }]}
        intro="Tell us about your child and how to reach you, and our team will get in touch shortly. Fields marked * are required."
      />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0 rounded-xl border border-ink/10 bg-white p-5 shadow-sm sm:p-10">
          <AdmissionForm captcha={captcha} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="relative -rotate-1 bg-note p-6 shadow-md">
            <i className="fa-solid fa-thumbtack absolute -top-2 left-6 text-maroon" aria-hidden="true"></i>
            <h2 className="font-hand text-3xl leading-none text-maroon">Need help?</h2>
            <p className="mt-3 text-sm leading-6 text-ink/80">Call the school office and we’ll be happy to guide you through admission.</p>
            {phones.length > 0 && (
              <p className="mt-3 font-bold">
                {phones.map((p, i) => (
                  <span key={p}>{i > 0 && " / "}<a href={tel(p)} className="hover:text-maroon">{p}</a></span>
                ))}
              </p>
            )}
            {hours && <p className="mt-1 text-sm text-ink/70">{hours}</p>}
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <h2 className="font-display text-lg font-semibold">More about Apex</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold">
              <li><a href={links.prospectus} target="_blank" rel="noopener noreferrer" className="text-maroon hover:underline">Download the prospectus <i className="fa-solid fa-file-pdf ml-1 text-xs" aria-hidden="true"></i></a></li>
              <li><Link href="/facilities" className="text-maroon hover:underline">Our facilities</Link></li>
              <li><Link href="/contact-us" className="text-maroon hover:underline">Visit the school</Link></li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
