import ApplyLink from "@/components/school/ApplyLink";
import { links } from "@/lib/site";
import { getSiteRegulars } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/school/PageHeader";
import Faq from "@/components/school/home/Faq";

export const metadata = pageMeta({
  title: "Admissions 2083",
  description:
    "Admission is open for 2083 at Apex Life School, Chabahil, Kathmandu. Apply through the online admission form, download the prospectus or call the school office.",
  path: "/admissions",
});

const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

export default async function AdmissionsPage() {
  const regulars = await getSiteRegulars();
  const phones = regulars?.phones ?? [];
  const email = regulars?.email ?? null;
  const hours = regulars?.hours ?? null;
  return (
    <>
      <PageHeader
        title="Admissions are open for 2083"
        eyebrow="Admissions"
        crumbs={[{ name: "Enrolment" }]}
        intro="Have a question about the process, the right grade or an age group? Get in touch — we’re happy to help you find the right fit for your child."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-3">
        <article className="rounded-xl border border-ink/10 bg-white p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-mint text-leaf-deep"><i className="fa-solid fa-pen-to-square" aria-hidden="true"></i></span>
          <h2 className="mt-5 font-display text-xl font-semibold">Apply online</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">Share your child’s details through the official admission form.</p>
          <ApplyLink href={links.admissionForm} className="mt-5 inline-block rounded-md bg-maroon px-5 py-2.5 text-sm font-bold text-paper hover:bg-maroon-deep">
            Start your application
          </ApplyLink>
        </article>

        <article className="rounded-xl border border-ink/10 bg-white p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-mint text-leaf-deep"><i className="fa-solid fa-file-lines" aria-hidden="true"></i></span>
          <h2 className="mt-5 font-display text-xl font-semibold">Read the prospectus</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">A complete guide to the school, in one PDF.</p>
          <a href={links.prospectus} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-md border-2 border-maroon px-5 py-2 text-sm font-bold text-maroon hover:bg-maroon hover:text-paper">
            Download the prospectus
          </a>
        </article>

        <article className="rounded-xl border border-ink/10 bg-white p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-mint text-leaf-deep"><i className="fa-solid fa-phone" aria-hidden="true"></i></span>
          <h2 className="mt-5 font-display text-xl font-semibold">Talk to us</h2>
          {hours && <p className="mt-2 text-sm leading-6 text-ink/70">{hours}</p>}
          {phones.length > 0 && (
            <p className="mt-3 text-sm font-bold">
              {phones.map((p, i) => (
                <span key={p}>{i > 0 && " / "}<a href={tel(p)} className="hover:text-maroon">{p}</a></span>
              ))}
            </p>
          )}
          {email && (
            <a href={`mailto:${email}`} className="mt-1 block text-sm font-bold hover:text-maroon">{email}</a>
          )}
        </article>
      </section>

      <Faq />
    </>
  );
}
