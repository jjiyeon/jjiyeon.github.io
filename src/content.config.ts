import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const letters = defineCollection({
  loader: glob({ base: './src/content/letters', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string(),
    letterSlug: z.string(),
    publishedAt: z.coerce.date(),
    week: z.string(),
    issue: z.number().int().positive(),
    category: z.enum(['work', 'dev', 'product', 'career', 'notes']),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

export const collections = { letters };
