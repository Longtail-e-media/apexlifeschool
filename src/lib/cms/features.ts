import { fetchAPI } from "../api";
import { list } from "./helpers";

// ── Raw API shape ─────────────────────────────────────────────────────────────

interface ApiFeatureChild {
  id: number;
  name: string;
  parent_id: number;
  icon: string | null;
  image: string | null;
  status: number;
  children: ApiFeatureChild[];
}

interface ApiFeatureGroup {
  id: number;
  name: string;
  parent_id: number;
  icon: string | null;
  image: string | null;
  status: number;
  children: ApiFeatureChild[];
}

// ── Public shapes ─────────────────────────────────────────────────────────────

export interface FeatureItem {
  id: number;
  name: string;
  /** Full Font Awesome class string, e.g. "fa-solid fa-people-group" */
  icon: string | null;
  image: string | null;
}

export interface FeatureGroup {
  id: number;
  name: string;
  items: FeatureItem[];
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function getAllFeatureGroups(): Promise<FeatureGroup[]> {
  const raw = list<ApiFeatureGroup>(await fetchAPI<unknown>("feature"));
  return raw
    .filter((g) => g.status === 1)
    .map((g) => ({
      id: g.id,
      name: g.name,
      items: (g.children ?? [])
        .filter((c) => c.status === 1)
        .map((c) => ({
          id: c.id,
          name: c.name,
          icon: c.icon ?? null,
          image: c.image ?? null,
        })),
    }));
}

/** Returns the first group whose name contains `keyword` (case-insensitive), or null. */
async function getFeatureGroup(keyword: string): Promise<FeatureGroup | null> {
  const groups = await getAllFeatureGroups();
  return groups.find((g) => g.name.toLowerCase().includes(keyword.toLowerCase())) ?? null;
}

// ── Domain helpers ────────────────────────────────────────────────────────────

/** Items for the "Why Apex?" reasons grid. */
export async function getWhyApexReasons(): Promise<FeatureItem[] | null> {
  const group = await getFeatureGroup("why apex");
  return group ? group.items : null;
}

/** Items for the curriculum "Teaching methods" grid. */
export async function getCurriculumMethods(): Promise<FeatureItem[] | null> {
  const group = await getFeatureGroup("method");
  return group ? group.items : null;
}
export async function getCurriculumSubject(): Promise<FeatureItem[] | null> {
  const group = await getFeatureGroup("subjects");
  return group ? group.items : null;
}

/** Items for the curriculum "Learning supports" list. */
export async function getCurriculumSupports(): Promise<FeatureItem[] | null> {
  const group = await getFeatureGroup("support");
  return group ? group.items : null;
}

