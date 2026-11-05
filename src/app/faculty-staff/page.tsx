import { pageMeta } from "@/lib/seo";
import { getFacultyCategories } from "@/lib/faculty";
import PageHeader from "@/components/school/PageHeader";
import FacultyGrid from "@/components/school/FacultyGrid";

export const metadata = pageMeta({
  title: "Faculty & Staff",
  description: "Meet the teachers and staff of Apex Life School in Chabahil, Kathmandu.",
  path: "/faculty-staff",
});

export default async function FacultyStaffPage() {
  const categories = await getFacultyCategories();
  return (
    <>
      <PageHeader
        title="Faculty & Staff"
        eyebrow="Meet our team"
        crumbs={[{ name: "The School", href: "/about-us" }, { name: "Faculty & Staff" }]}
        intro="The teachers who make Apex a place where children love to learn."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <FacultyGrid categories={categories} />
      </div>
    </>
  );
}
