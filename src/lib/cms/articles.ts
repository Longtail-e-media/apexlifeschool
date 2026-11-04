import { fetchAPI } from "../api";
import { list, toParagraphs, toListItems } from "./helpers";

export interface ApiArticle {
  id?: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  gallery_images?: { src?: string }[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export const getArticles = async () => list<ApiArticle>(await fetchAPI<unknown>("article_all"));

export const articleText = (a?: ApiArticle) => toParagraphs(a?.content ?? "").join(" ");

export interface About {
  summary: string;
  mission: string;
  vision: string;
  videos: string[];
  recognitions: string[];
}

export async function getAbout(): Promise<About> {
  const articles = await getArticles();
  const by = (slug: string) => articleText(articles.find((a) => a.slug === slug));
  return {
    summary: by("about-us"),
    mission: by("mission"),
    vision: by("vision"),
    videos: ["/apex/video/ilVOIoi.mp4", "/apex/video/xTqwM8R.mp4"],
    recognitions: [
      "/apex/gallery/iuKycRXvAWcqXBTN-1765264138.jpg",
      "/apex/gallery/IK6oY2LQNCUh5Hww-1741581341.png",
      "/apex/gallery/6rff4reHlxv37wsc-1741581341.jpeg",
    ],
  };
}

export interface Person {
  name: string;
  role: string;
  photo: string | null;
  paragraphs: string[];
}

function toPerson(a: ApiArticle | undefined, defaultPhoto: string | null = null): Person | null {
  if (!a) return null;
  const paragraphs = toParagraphs(a.content ?? "");
  if (paragraphs.length === 0) return null;
  const [name, ...role] = (a.subtitle ?? "").split(/\s+-\s+/);
  return {
    name: name?.trim() || a.title || "",
    role: role.join(" - ").trim() || "",
    photo: a.gallery_images?.[0]?.src || defaultPhoto,
    paragraphs,
  };
}

export async function getMessages(): Promise<{ chairperson: Person | null; principal: Person | null }> {
  const articles = await getArticles();
  return {
    chairperson: toPerson(articles.find((a) => a.slug === "message-from-chairperson"), "/apex/brand/director.png"),
    principal: toPerson(articles.find((a) => a.slug === "message-from-principal"), "/apex/brand/principal.png"),
  };
}

export interface Milestone {
  year: string;
  title: string;
  text: string;
}

export async function getGlanceHtml(): Promise<{ title: string; subtitle: string; html: string } | null> {
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === "apex-at-a-glance");
  if (!article?.content) return null;
  return {
    title: article.title ?? "Apex at a glance",
    subtitle: article.subtitle ?? "The school in numbers",
    html: article.content,
  };
}

export async function getHistory(): Promise<Milestone[]> {
  const rows = (await getArticles())
    .filter((a) => a.slug?.startsWith("milestone-") && a.title)
    .sort((a, b) => parseInt(a.slug!.slice(10), 10) - parseInt(b.slug!.slice(10), 10));
  return rows.map((a) => ({ year: a.subtitle?.trim() ?? "", title: a.title as string, text: articleText(a) }));
}

export interface CurriculumStage {
  id: string;
  grades: string;
  title: string;
  intro: string;
  points: string[];
  content?: string;
}

export async function getCurriculumStages(): Promise<CurriculumStage[] | null> {
  const articles = await getArticles();
  const rows = articles.filter(
    (a) => a.slug && (a.slug.startsWith("curriculum-") || a.slug.startsWith("curriculum_") || a.slug === "curriculum") && a.title
  );
  if (rows.length === 0) return null;

  rows.sort((a, b) => parseInt(a.id || "0", 10) - parseInt(b.id || "0", 10));

  return rows.map((a) => {
    const grades = a.subtitle?.trim() || "";
    // Clean redundant grade prefix from title if present (e.g. "Grades I–VII: The national...")
    const title = grades
      ? a.title!.replace(new RegExp(`^${grades}[:\\s–-]+`, "i"), "").trim()
      : a.title!;
    const paragraphs = toParagraphs(a.content ?? "");
    const points = toListItems(a.content ?? "");

    return {
      id: a.id || a.slug || title,
      grades,
      title,
      intro: paragraphs[0] || "",
      points,
      content: a.content,
    };
  });
}

export async function getPreparingForSee(): Promise<{ title: string; intro: string } | null> {
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === "preparing-for-the-see");
  if (!article) return null;
  return {
    title: article.title || "Preparing for the SEE",
    intro: articleText(article),
  };
}

