
"use server";

import { intelligentEmojiSearch } from "@/ai/flows/intelligent-emoji-search";
import type { Emoji } from "@/lib/types";

export async function searchEmojisAction(
  query: string,
  lang: string
): Promise<{ results: Emoji[]; error?: string }> {
  if (!query || query.length < 2) {
    return { results: [] };
  }

  try {
    const response = await intelligentEmojiSearch({ query, lang });
    return { results: response.results as Emoji[] };
  } catch (error) {
    console.error("Error in searchEmojisAction:", error);
    // Fallback to simple search on error
    return { results: [], error: "An error occurred during AI-powered search." };
  }
}
