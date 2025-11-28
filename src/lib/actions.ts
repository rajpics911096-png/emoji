
"use server";

import { intelligentEmojiSearch } from "@/ai/flows/intelligent-emoji-search";
import { emojis as initialEmojis } from "@/lib/data";
import type { Emoji } from "@/lib/types";

// This is a server action, but for the prototype, we're using mock data.
// In a real app, you would fetch from a database.
// The store is client-side only, so we rely on the initial data here.

export async function searchEmojisAction(
  query: string
): Promise<{ results: Emoji[]; error?: string }> {
  if (!query) {
    return { results: [] };
  }

  try {
    // Calling the GenAI flow as requested.
    // Note: The provided flow returns a mock array of strings ['emoji1', 'emoji2', 'emoji3'],
    // which isn't directly usable for filtering our structured data.
    // For a real-world application, this AI would return IDs or structured data.
    // Here, we'll proceed to perform a simple text search on our mock data to provide a functional UI.
    await intelligentEmojiSearch({ query });
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const lowercasedQuery = query.toLowerCase();
    const results = initialEmojis.filter(
      (emoji) =>
        emoji.title.toLowerCase().includes(lowercasedQuery) ||
        emoji.description.toLowerCase().includes(lowercasedQuery) ||
        emoji.emoji.includes(lowercasedQuery)
    );

    return { results };
  } catch (error) {
    console.error("Error in searchEmojisAction:", error);
    return { results: [], error: "An error occurred during search." };
  }
}
