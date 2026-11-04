import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/** Official logo. `onDark` puts it on a cream plate so the maroon lettering stays legible. */
export default function Logo({ onDark = false, priority = false }: { onDark?: boolean; priority?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={`flex items-center ${onDark ? "w-fit rounded-2xl bg-paper px-4 py-2" : ""}`}
    >
      <Image
        src={site.logo}
        alt={`${site.name} — ${site.tagline}`}
        width={190}
        height={85}
        preload={priority}
        className="h-11 w-auto sm:h-12"
      />
    </Link>
  );
}
