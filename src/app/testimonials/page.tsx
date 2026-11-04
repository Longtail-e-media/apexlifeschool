import Link from "next/link";
import { links } from "@/lib/site";
import { getLifeAtApex } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/school/PageHeader";
import TestimonialVideos from "@/components/school/TestimonialVideos";

export const metadata = pageMeta({
  title: "Parent's Testimonial",
  description: "Hear from Apex Life School parents and students about life at school in Chabahil, Kathmandu.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  // Parents first, then students. Each card plays the person's YouTube video in place.
  const people = [...(await getLifeAtApex())].sort((a, b) => Number(b.role === "Parent") - Number(a.role === "Parent"));

  return (
    <>
      <PageHeader
        title="In their own words"
        eyebrow="Parent's testimonial"
        crumbs={[{ name: "Stories" }, { name: "Parent's testimonial" }]}
        intro="Parents and students on what it is like to be part of Apex."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        {people.length > 0 ? (
          <TestimonialVideos items={people} />
        ) : (
          <p className="py-12 text-center text-ink/60">No testimonials available at the moment.</p>
        )}

        <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-ink/10 bg-white p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">Are you part of the Apex family?</h2>
          <p className="mt-2 text-ink/70">We’d love to hear your story, or to answer your questions if you’re thinking about joining us.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact-us" className="rounded-md bg-maroon px-6 py-3 font-bold text-paper hover:bg-maroon-deep">Get in touch</Link>
            <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="rounded-md border-2 border-maroon px-6 py-2.5 font-bold text-maroon hover:bg-maroon hover:text-paper">
              Watch on YouTube
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
