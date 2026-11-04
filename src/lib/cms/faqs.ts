import { fetchAPI } from "../api";
import { list, toText } from "./helpers";

export interface FaqItem {
  q: string;
  a: string;
}

export async function getFaqs(): Promise<FaqItem[]> {
  const rows = list<{ question?: string; answer?: string }>(await fetchAPI<unknown>("faq"))
    .map((f) => ({ q: toText(f.question ?? ""), a: toText(f.answer ?? "") }))
    .filter((f) => f.q && f.a);
  return rows;
}
