"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="ruled border-b border-ink/10">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-hand text-3xl text-maroon">Something went wrong</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Please try again</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/70">
          We hit a problem loading this page. It is usually temporary.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-md bg-maroon px-6 py-3 font-bold text-paper hover:bg-maroon-deep">Try again</button>
          <Link href="/" className="rounded-md border-2 border-maroon px-6 py-2.5 font-bold text-maroon hover:bg-maroon hover:text-paper">Go to the homepage</Link>
        </div>
      </div>
    </section>
  );
}
