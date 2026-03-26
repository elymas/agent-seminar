import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sessions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sessions' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    week: z.number(),
    weekTheme: z.string(),
    type: z.enum(['concept', 'practice', 'special']),
    mission: z.string().optional(),
    level: z.string(),
    keyMessage: z.string(),
    deliverable: z.string(),
    timeStructure: z.string(),
    status: z.enum(['completed', 'current', 'upcoming']).default('upcoming'),
    bookRef: z.string().optional(),
  }),
});

export const collections = { sessions };
