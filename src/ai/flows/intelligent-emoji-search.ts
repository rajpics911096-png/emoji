
'use server';

/**
 * @fileOverview A Genkit flow for intelligent emoji search using keywords, categories, or descriptions.
 *
 * - intelligentEmojiSearch - A function that performs the emoji search.
 * - IntelligentEmojiSearchInput - The input type for the intelligentEmojiSearch function.
 * - IntelligentEmojiSearchOutput - The return type for the intelligentEmojiSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { emojis as allEmojis } from '@/lib/data';
import translations from '@/lib/translations';

const IntelligentEmojiSearchInputSchema = z.object({
  query: z.string().describe('The search query provided by the user.'),
  lang: z.string().describe('The language of the user query.'),
});
export type IntelligentEmojiSearchInput = z.infer<typeof IntelligentEmojiSearchInputSchema>;

const IntelligentEmojiSearchOutputSchema = z.object({
  results: z
    .array(
        z.object({
            id: z.string(),
            emoji: z.string(),
            title: z.string(),
            description: z.string(),
            category: z.string(),
        })
    )
    .describe('A list of relevant emoji objects based on the search query.'),
});
export type IntelligentEmojiSearchOutput = z.infer<typeof IntelligentEmojiSearchOutputSchema>;

export async function intelligentEmojiSearch(input: IntelligentEmojiSearchInput): Promise<IntelligentEmojiSearchOutput> {
  return intelligentEmojiSearchFlow(input);
}

const searchEmojis = ai.defineTool({
  name: 'searchEmojis',
  description: 'Searches for emojis based on the provided query.',
  inputSchema: z.object({
    query: z.string().describe('The query to search for emojis.'),
    lang: z.string().describe('The language of the user query (e.g., "en", "es").'),
  }),
  outputSchema: z.array(z.object({
    id: z.string(),
    emoji: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
  })).describe('A list of emoji objects that match the query.'),
},
async ({ query, lang }) => {
    const lowercasedQuery = query.toLowerCase();
    const currentLang = (translations[lang as keyof typeof translations] ? lang : 'en') as keyof typeof translations;

    const t = (key: string) => {
        return translations[currentLang]?.[key] || translations['en'][key] || key;
    }

    const results = allEmojis.filter(emoji => {
        const title = t(emoji.title).toLowerCase();
        const description = t(emoji.description).toLowerCase();
        return title.includes(lowercasedQuery) ||
               description.includes(lowercasedQuery) ||
               emoji.emoji.includes(lowercasedQuery);
    }).map(emoji => ({
        id: emoji.id,
        emoji: emoji.emoji,
        title: t(emoji.title),
        description: t(emoji.description),
        category: emoji.category,
    }));
    
    return results.slice(0, 10); // Return top 10 matches
  }
);

const intelligentEmojiSearchPrompt = ai.definePrompt({
  name: 'intelligentEmojiSearchPrompt',
  input: {schema: IntelligentEmojiSearchInputSchema},
  output: {schema: IntelligentEmojiSearchOutputSchema},
  tools: [searchEmojis],
  prompt: `You are an AI assistant designed to help users find emojis based on their search query.

  When the user provides a query, use the searchEmojis tool to find relevant emojis.

  Based on the search results, return a list of emoji objects that best match the user's intent.

  User Query: {{{query}}}
  Language: {{{lang}}}
  `,
});

const intelligentEmojiSearchFlow = ai.defineFlow(
  {
    name: 'intelligentEmojiSearchFlow',
    inputSchema: IntelligentEmojiSearchInputSchema,
    outputSchema: IntelligentEmojiSearchOutputSchema,
  },
  async input => {
    const llmResponse = await intelligentEmojiSearchPrompt(input);
    const toolCalls = llmResponse.toolCalls();

    if (toolCalls.length > 0) {
        const toolOutput = await toolCalls[0].run();
        const emojiResults = toolOutput as any[];
        
        const finalResults = emojiResults.map(res => {
            const originalEmoji = allEmojis.find(e => e.id === res.id);
            return originalEmoji ? {
                id: originalEmoji.id,
                emoji: originalEmoji.emoji,
                title: originalEmoji.title, // Return the key
                description: originalEmoji.description, // Return the key
                category: originalEmoji.category,
                formats: originalEmoji.formats,
                related: originalEmoji.related,
                views: originalEmoji.views,
                createdAt: originalEmoji.createdAt
            } : null;
        }).filter((e): e is any => e !== null);

        return { results: finalResults };
    }
    
    return { results: [] };
  }
);
