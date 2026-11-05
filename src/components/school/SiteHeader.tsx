import ApplyLink from "./ApplyLink";
import { links } from "@/lib/site";
import { getMainMenu, getSocial, getSiteRegulars } from "@/lib/cms";
import Logo from "./Logo";
import MenuOverlay from "./MenuOverlay";

const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

/** Contact bar (scrolls away) + sticky main header, like a school office noticeboard. */
export default async function SiteHeader() {
  const [mainMenu, social, regulars] = await Promise.all([
    getMainMenu(),
    getSocial(),
    getSiteRegulars(),
  ]);

  const phones = regulars?.phones ?? [];
  const email = regulars?.email ?? null;
  const address = regulars?.address ?? null;
  const hours = regulars?.hours ?? null;

  return (
    <>
      <div className="hidden bg-maroon-deep text-xs text-paper/85 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <ul className="flex items-center gap-6">
            {phones.length > 0 && (
              <li>
                <i className="fa-solid fa-phone mr-2 text-sun" aria-hidden="true"></i>
                {phones.map((p, i) => (
                  <a key={p} href={tel(p)} className="hover:text-sun">{p}{i < phones.length - 1 ? " / " : ""}</a>
                ))}
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-sun">
                  <i className="fa-solid fa-envelope mr-2 text-sun" aria-hidden="true"></i>
                  {email}
                </a>
              </li>
            )}
            {hours && (
              <li>
                <i className="fa-solid fa-clock mr-2 text-sun" aria-hidden="true"></i>
                {hours}
              </li>
            )}
          </ul>
          <ul className="flex items-center gap-4">
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="hover:text-sun">
                  <i className={`fa-brands ${s.icon}`} aria-hidden="true"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo priority />
          <div className="flex items-center gap-3">
            <ApplyLink
              href="https://als.mpathshala.com/"
              className="hidden rounded-md bg-maroon px-5 py-2.5 text-sm font-bold text-paper transition hover:bg-maroon-deep sm:block"
            >
              Login
            </ApplyLink>
            <MenuOverlay menu={mainMenu} phones={phones} email={email ?? ""} address={address ?? ""} hours={hours ?? ""} />
          </div>
        </div>
      </header>
    </>
  );
}
