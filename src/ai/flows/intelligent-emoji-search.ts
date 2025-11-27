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

const IntelligentEmojiSearchInputSchema = z.object({
  query: z.string().describe('The search query provided by the user.'),
});
export type IntelligentEmojiSearchInput = z.infer<typeof IntelligentEmojiSearchInputSchema>;

const IntelligentEmojiSearchOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('A list of relevant emoji names based on the search query.'),
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
  }),
  outputSchema: z.array(z.string()).describe('A list of emoji names that match the query.'),
},
async (input) => {
    // TODO: Implement the actual emoji search logic here. This is a placeholder.
    // This function should connect to the database or other data source
    // and return a list of emoji names that match the query.
    // For now, return a dummy list.
    return ['emoji1', 'emoji2', 'emoji3'];
  }
);

const intelligentEmojiSearchPrompt = ai.definePrompt({
  name: 'intelligentEmojiSearchPrompt',
  input: {schema: IntelligentEmojiSearchInputSchema},
  output: {schema: IntelligentEmojiSearchOutputSchema},
  tools: [searchEmojis],
  prompt: `You are an AI assistant designed to help users find emojis based on their search query.

  When the user provides a query, use the searchEmojis tool to find relevant emojis.

  Based on the search results, return a list of emoji names that best match the user's intent.

  User Query: {{{query}}}
  `,
});

const intelligentEmojiSearchFlow = ai.defineFlow(
  {
    name: 'intelligentEmojiSearchFlow',
    inputSchema: IntelligentEmojiSearchInputSchema,
    outputSchema: IntelligentEmojiSearchOutputSchema,
  },
  async input => {
    const {output} = await intelligentEmojiSearchPrompt(input);
    return output!;
  }
);
