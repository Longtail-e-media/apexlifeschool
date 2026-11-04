import Image from "next/image";
import { links } from "@/lib/site";

const qrs = [
  { src: links.playStoreQr, href: links.playStore, label: "Google Play", icon: "fa-google-play" },
  { src: links.appStoreQr, href: links.appStore, label: "App Store", icon: "fa-apple" },
];

export default function AppPromo() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] lg:gap-14">
      <Image
        src={links.appPromo}
        alt="Apex Life School mobile app"
        width={500}
        height={500}
        sizes="208px"
        className="mx-auto h-auto w-44 sm:w-52"
      />

      <div className="min-w-0">
        <p className="font-hand text-2xl leading-none text-maroon">School app</p>
        <h2 className="mt-1 font-display text-2xl font-semibold leading-snug sm:text-3xl">School life, in your pocket</h2>
        <p className="mt-3 max-w-lg text-ink/70">Get notices and school updates on Google Play or the App Store.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href={links.playStore} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play" className="rounded-lg bg-ink px-3 py-2">
            <Image src={links.playStoreBadge} alt="Get it on Google Play" width={135} height={40} className="h-9 w-auto" />
          </a>
          <a href={links.appStore} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store" className="rounded-lg bg-ink px-3 py-2">
            <Image src={links.appStoreBadge} alt="Download on the App Store" width={135} height={40} className="h-9 w-auto" />
          </a>
        </div>
      </div>

      {/* QR codes: for visitors on a computer. Hidden on phones, where the store buttons above do the job. */}
      <div className="hidden rounded-xl border border-ink/10 bg-white p-6 md:col-span-2 md:block md:justify-self-center lg:col-span-1 lg:justify-self-end">
        <p className="font-hand text-3xl leading-none text-maroon">Scan to download</p>
        <p className="mt-1 text-sm text-ink/60">Point your phone’s camera at a code.</p>
        <ul className="mt-5 grid grid-cols-2 gap-5">
          {qrs.map((q) => (
            <li key={q.label} className="text-center">
              <a href={q.href} target="_blank" rel="noopener noreferrer" aria-label={`Download from ${q.label}`} className="block">
                <Image
                  src={q.src}
                  alt={`QR code to download the Apex Life School app from ${q.label}`}
                  width={128}
                  height={128}
                  sizes="128px"
                  className="h-32 w-32 rounded-md border border-ink/15"
                />
              </a>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm font-bold">
                <i className={`fa-brands ${q.icon} text-maroon`} aria-hidden="true"></i>
                {q.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
