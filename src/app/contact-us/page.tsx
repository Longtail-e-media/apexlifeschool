import { getSocial, getSiteRegulars } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import ContactForm from "@/components/school/ContactForm";
import PageHeader from "@/components/school/PageHeader";

export const metadata = pageMeta({
  title: "Contact Us",
  description: "Contact Apex Life School, Chabahil, Kathmandu. Send us a message or call our school office for admissions and inquiries.",
  path: "/contact-us",
});

const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

export default async function ContactPage() {
  const [social, regulars] = await Promise.all([getSocial(), getSiteRegulars()]);

  const phones = regulars?.phones ?? [];
  const email = regulars?.email ?? null;
  const address = regulars?.address ?? null;
  const mapUrl = regulars?.mapUrl ?? null;
  const mapEmbed = regulars?.locationMapEmbed || "https://www.google.com/maps?q=Apex+Life+School+Chabahil+Kathmandu&output=embed";
  const hours = regulars?.hours ?? null;

  const contactCards = [
    address && {
      icon: "fa-location-dot",
      title: "Find us here",
      body: (
        <a href={mapUrl || "#"} target={mapUrl ? "_blank" : undefined} rel="noopener noreferrer" className="hover:text-maroon">
          {address}
        </a>
      ),
    },
    phones.length > 0 && {
      icon: "fa-phone",
      title: "Call",
      body: phones.map((p) => (
        <a key={p} href={tel(p)} className="block hover:text-maroon">
          {p}
        </a>
      )),
    },
    email && {
      icon: "fa-envelope",
      title: "Email",
      body: (
        <a href={`mailto:${email}`} className="hover:text-maroon">
          {email}
        </a>
      ),
    },
    hours && {
      icon: "fa-clock",
      title: "Official hours",
      body: hours,
    },
  ].filter(Boolean) as { icon: string; title: string; body: React.ReactNode }[];

  return (
    <>
      <PageHeader
        title="We’d love to hear from you"
        eyebrow="Get in touch"
        crumbs={[{ name: "Find Us" }]}
        intro="Thinking about admission, or just want to see the school? Send us a message or call, and we’ll be glad to help."
      />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          {contactCards.map((c) => (
            <div key={c.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint text-leaf-deep">
                <i className={`fa-solid ${c.icon}`} aria-hidden="true"></i>
              </span>
              <div className="min-w-0">
                <h2 className="text-xs font-bold uppercase tracking-widest text-ink/50">{c.title}</h2>
                <div className="mt-1 font-semibold [overflow-wrap:anywhere]">{c.body}</div>
              </div>
            </div>
          ))}

          <ul className="flex gap-3 pt-2">
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 hover:border-maroon hover:text-maroon">
                  <i className={`fa-brands ${s.icon}`} aria-hidden="true"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 rounded-xl border border-ink/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <iframe
          title="Apex Life School location map"
          src={mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-96 w-full rounded-xl border border-ink/10"
        />
      </section>
    </>
  );
}
