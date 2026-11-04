import { getGlanceHtml } from "@/lib/cms";
import SectionHead from "./SectionHead";

/** `tone` is the section background: "white" (default) or "paper" (cream), so it can alternate with its neighbours. */
export default async function Glance({ tone = "white" }: { tone?: "white" | "paper" }) {
  const data = await getGlanceHtml();
  if (!data) return null;

  const bg = tone === "white" ? "bg-white" : "bg-paper";

  return (
    <section className={`border-y border-ink/10 ${bg} py-16 sm:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow={data.title} title={data.subtitle} />
        <div dangerouslySetInnerHTML={{ __html: data.html }} />
      </div>
    </section>
  );
}
