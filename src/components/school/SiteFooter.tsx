import Image from "next/image";
import Link from "next/link";
import { site, recognitions, links } from "@/lib/site";
import { getFooterMenu, getSocial, getSiteRegulars } from "@/lib/cms";
import Logo from "./Logo";

const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;
const heading = "text-xs font-bold uppercase tracking-[0.2em] text-paper/50";

export default async function SiteFooter() {
  const [footerNews, social, regulars] = await Promise.all([
    getFooterMenu(),
    getSocial(),
    getSiteRegulars(),
  ]);

  const address = regulars?.address ?? null;
  const phones = regulars?.phones ?? [];
  const email = regulars?.email ?? null;
  const mapUrl = regulars?.mapUrl ?? null;
  const hours = regulars?.hours ?? null;
  const copyrightText = regulars?.copyright
    ? regulars.copyright.replace("{year}", String(new Date().getFullYear()))
    : `© ${new Date().getFullYear()} ${site.name}. All rights reserved.`;

  return (
    <footer className="relative mt-auto overflow-hidden bg-maroon-deep text-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-12 pt-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.2fr_1fr]">
        <div className="min-w-0">
          <Logo onDark />
          <p className="mt-6 font-hand text-4xl leading-none">
            Schooling for <span className="text-sun">life.</span>
          </p>
          <ul className="mt-6 flex gap-3">
            {social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 transition hover:border-sun hover:bg-sun hover:text-ink"
                >
                  <i className={`fa-brands ${s.icon}`} aria-hidden="true"></i>
                </a>
              </li>
            ))}
          </ul>

          <h2 className={`${heading} mt-8`}>Recognised by</h2>
          <ul className="mt-4 flex gap-3">
            {recognitions.map((src, i) => (
              <li key={src} className="relative h-14 w-18 rounded-md bg-paper">
                <Image src={src} alt={`Apex Life School recognition ${i + 1}`} fill sizes="72px" className="object-contain p-1.5" />
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="News">
          <h2 className={heading}>News</h2>
          <ul className="mt-4 space-y-2.5">
            {footerNews.map((n) => (
              <li key={n.id}>
                <Link href={n.link} className="text-paper/85 hover:text-sun">{n.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className={heading}>Find us</h2>
          <ul className="mt-4 space-y-2.5 text-paper/85">
            {address && (
              <li>
                {mapUrl ? (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sun">{address}</a>
                ) : (
                  <span>{address}</span>
                )}
              </li>
            )}
            {phones.map((p) => (
              <li key={p}><a href={tel(p)} className="hover:text-sun">{p}</a></li>
            ))}
            {email && (
              <li><a href={`mailto:${email}`} className="hover:text-sun">{email}</a></li>
            )}
            {hours && (
              <li className="text-paper/60">{hours}</li>
            )}
          </ul>
        </address>

        <div>
          <h2 className={heading}>Get the app</h2>
          <p className="mt-4 text-sm text-paper/70">Notices and school updates on your phone.</p>
          <div className="mt-4 flex flex-wrap gap-3 lg:flex-col lg:items-start">
            <a href={links.playStore} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play" className="rounded-lg bg-ink px-3 py-2 ring-1 ring-paper/20 transition hover:ring-sun">
              <Image src={links.playStoreBadge} alt="Get it on Google Play" width={135} height={40} className="h-9 w-auto" />
            </a>
            <a href={links.appStore} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store" className="rounded-lg bg-ink px-3 py-2 ring-1 ring-paper/20 transition hover:ring-sun">
              <Image src={links.appStoreBadge} alt="Download on the App Store" width={135} height={40} className="h-9 w-auto" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-paper/10 px-6 py-5 text-xs text-paper/50 sm:flex-row sm:px-8">
        <span>{copyrightText}</span>
        <span>
          Developed by{" "}
          <a href="https://longtail.info" target="_blank" rel="noopener noreferrer" className="text-paper hover:text-sun">Longtail e-media</a>
        </span>
      </div>
    </footer>
  );
}
