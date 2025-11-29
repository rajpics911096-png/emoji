
"use server";

import { intelligentEmojiSearch } from "@/ai/flows/intelligent-emoji-search";
import { emojis as initialEmojis } from "@/lib/data";
import type { Emoji } from "@/lib/types";
import translations from "./translations";

type TranslationLang = keyof typeof translations;

export async function searchEmojisAction(
  query: string,
  lang: string
): Promise<{ results: Emoji[]; error?: string }> {
  if (!query) {
    return { results: [] };
  }

  try {
    await intelligentEmojiSearch({ query });
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const lowercasedQuery = query.toLowerCase();
    const currentLang = (translations[lang as TranslationLang] ? lang : 'en') as TranslationLang;
    
    const results = initialEmojis.filter(
      (emoji) => {
        const title = (translations[currentLang][emoji.title] || translations['en'][emoji.title]).toLowerCase();
        const description = (translations[currentLang][emoji.description] || translations['en'][emoji.description]).toLowerCase();
        
        return title.includes(lowercasedQuery) ||
               description.includes(lowercasedQuery) ||
               emoji.emoji.includes(lowercasedQuery);
      }
    );

    return { results };
  } catch (error) {
    console.error("Error in searchEmojisAction:", error);
    return { results: [], error: "An error occurred during search." };
  }
}
