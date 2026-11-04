export function parseAPIResponse<T>(text: string): T {
  // Clean up double slashes in URLs from the backend
  const cleanedText = text.replace(/(https?:\/\/[^\/]+)\/\/backend\//g, '$1/backend/');
  
  try {
    // Try normal JSON first
    return JSON.parse(cleanedText);
  } catch {
    // Fallback: handle weird CMS format
    const match = cleanedText.match(/=\s*(\[[\s\S]*\]|\{[\s\S]*\})\s*;/);

    if (!match) {
      console.error("Invalid API format:", cleanedText);
      throw new Error("Invalid API format");
    }

    return JSON.parse(match[1]);
  }
}
