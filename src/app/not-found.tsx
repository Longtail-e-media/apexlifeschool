import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="ruled border-b border-ink/10">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-hand text-3xl text-maroon">Oops!</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">We can’t find that page</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/70">
          The page may have moved or the link may be wrong. Let’s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-md bg-maroon px-6 py-3 font-bold text-paper hover:bg-maroon-deep">Go to the homepage</Link>
          <Link href="/contact-us" className="rounded-md border-2 border-maroon px-6 py-2.5 font-bold text-maroon hover:bg-maroon hover:text-paper">Contact the school</Link>
        </div>
      </div>
    </section>
  );
}
