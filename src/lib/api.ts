import { parseAPIResponse } from "./parser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Fetches data from the CMS API. Resolves to null when the API is unset or unreachable,
 * so callers can fall back to their static content.
 */
export async function fetchAPI<T>(endpoint: string, program?: string, stream?: string): Promise<T | null> {
  if (BASE_URL) {
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint}${program ? `/${program}` : ""}${stream ? `/${stream}` : ""}`;

      const tag = endpoint.replace("api_", "").replace(".php", "");

      const response = await fetch(url, { next: { revalidate: 3600, tags: [tag] } });
      
      if (response.ok) {
        const text = await response.text();
        let data = parseAPIResponse<Record<string, unknown>>(text);

        // If the API returns the data wrapped in an object keyed by endpoint
        if (program && data && typeof data === "object") {
          data = (data[program] as Record<string, unknown>) || data;
        }

        // Clean any HTML content if present
        if (data && typeof data === "object" && typeof data.html === "string") {
          data.html = cleanArticleHTML(data.html);
        }

        return data as T;
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    }
  }

  // API unavailable (or BASE_URL unset): callers fall back to their static content.
  return null;
}

/**
 * Strips legacy/technical background classes from API HTML.
 */
function cleanArticleHTML(html: string): string {
  if (!html) return "";
  return html;
}
