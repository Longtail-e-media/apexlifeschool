import { getActivities } from "@/lib/cms";
import SectionHead from "./SectionHead";

function Tags({ items, tone }: { items: string[]; tone: string }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((it) => (
        <li key={it} className={`rounded-full px-3.5 py-1 text-sm font-bold ${tone}`}>
          {it}
        </li>
      ))}
    </ul>
  );
}

export default async function Activities() {
  const [eca, cre, yoga] = await getActivities();
  const cards = [
    { a: eca, tone: "bg-maroon/10 text-maroon" },
    { a: cre, tone: "bg-leaf/15 text-leaf-deep" },
  ].filter((c) => c.a);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead eyebrow="Beyond lessons" title="More to learn than what’s in the books" href="/activities" linkText="See all activities" />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {cards.map(({ a, tone }) => (
          <article key={a.title} className="rounded-xl border border-ink/10 bg-white p-6">
            {/* "Sports & fitness (ECA)" -> "Sports & fitness" */}
            <h3 className="font-hand text-3xl leading-none text-maroon">{a.title.replace(/\s*\(.*\)\s*$/, "")}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/70">{a.text}</p>
            <Tags items={a.items} tone={tone} />
          </article>
        ))}
      </div>
      {yoga && (
        <p className="mt-6 rounded-xl bg-note/70 p-5 text-sm leading-6 text-ink/80">
          <strong className="font-hand text-xl text-maroon">{yoga.title}: </strong>
          {yoga.text}
        </p>
      )}

    </section>
  );
}
