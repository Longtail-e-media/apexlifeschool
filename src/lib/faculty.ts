export interface FacultyMember {
  name: string;
  role: string;
  /** Path under /public, e.g. "/apex/faculty/jane-doe.jpg". Leave empty to show a placeholder icon. */
  photo?: string;
  qualification?: string;
  email?: string;
  bio?: string;
}

export interface FacultyCategory {
  id: string;
  title: string;
  position?: string;
  members: FacultyMember[];
}

const TEAM_API_URL = "https://mayurstay.com/apexlifeschool/api/v1/team";

interface TeamApiItem {
  id: string;
  name: string;
  position: string;
  /** Name of the CMS role/category the person belongs to; used as the section title. */
  role?: string;
  image?: string;
  content?: string;
}

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Fetches the team from the CMS and groups it by role. Resolves to the static list below
 * when the API is unreachable or returns nothing.
 */
export async function getFacultyCategories(): Promise<FacultyCategory[]> {
  try {
    const res = await fetch(TEAM_API_URL, { next: { revalidate: 3600, tags: ["team"] } });
    if (!res.ok) return facultyCategories;
    const items: TeamApiItem[] = await res.json();
    if (!Array.isArray(items) || items.length === 0) return facultyCategories;

    const groups = new Map<string, FacultyCategory>();
    for (const t of items) {
      const roleName = String(t.role ?? "").trim() || "Staff";
      const id = roleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "staff";
      if (!groups.has(id)) groups.set(id, { id, title: roleName, members: [] });
      groups.get(id)!.members.push({
        name: t.name,
        role: t.position?.trim() || "Staff",
        photo: t.image ? encodeURI(t.image) : undefined,
        bio: t.content ? stripHtml(t.content) || undefined : undefined,
      });
    }
    return [...groups.values()];
  } catch (error) {
    console.error("Team API fetch error:", error);
    return facultyCategories;
  }
}

/**
 * Static fallback, used when the team API is unavailable. Edit this list to add teachers: drop the photo in public/apex/faculty/
 * and reference it with `photo`. The names below are placeholders.
 */
export const facultyCategories: FacultyCategory[] = [
  {
    id: "science",
    title: "Administrator",
    members: [
      {
        name: "Teacher Name ",
        role: "Role",
        qualification: "M.Sc., Physics",
        email: "teacher@example.com",
        bio: "Short biography of the teacher goes here: experience, interests and what they bring to the classroom.",
      },

    ],
  },
  {
    id: "math",
    title: "Teachers",
    members: [
      { name: "Teacher Name", role: "Math Teacher", qualification: "M.Sc., Mathematics" },
    ],
  },
  {
    id: "english",
    title: "Staff",
    members: [{ name: "Teacher Name", role: "English Teacher" }],
  },
];
