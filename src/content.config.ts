import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const demoNames = ['copilot-diagnostics', 'trusted-answers', 'pcc', 'mapstore', 'bridgeto'] as const;

const media = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('video'),
    src: z.string(),
    poster: z.string().optional(),
    frame: z.enum(['none', 'laptop', 'phone']).default('none'),
    fit: z.enum(['cover', 'contain']).default('cover'),
    bg: z.string().optional(),
    start: z.number().optional(),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal('youtube'),
    id: z.string(),
    title: z.string(),
    start: z.number().optional(),
    hd: z.boolean().default(false),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal('demo'),
    name: z.enum(demoNames),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal('image'),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
]);

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    org: z.string(),
    role: z.string(),
    period: z.coerce.string(),
    order: z.number(),
    group: z.enum(['work', 'building', 'community']),
    summary: z.string(),
    card: media,
    hero: media.optional(),
    metrics: z.array(z.object({ value: z.coerce.string(), label: z.string() })).default([]),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }),
});

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { work, writing };
