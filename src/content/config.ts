import { defineCollection, reference, z } from 'astro:content';

/**
 * Authors — file-based author profiles. One markdown file per author at
 * src/content/authors/<slug>.md. Used as a `reference()` on every blog
 * post, so a typo in `author:` throws a build error instead of a broken
 * byline.
 *
 * The body of each author file is rendered on /blog/authors/<slug> as
 * the long-form bio.
 */
const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    /** Short bio, ~140 chars. Shown under the byline + on the author page header. */
    bio: z.string(),
    /** Optional path to a square avatar image (recommend 512x512). */
    avatar: z.string().optional().nullable(),
    socials: z
      .object({
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        github: z.string().url().optional(),
        website: z.string().url().optional(),
        email: z.string().email().optional(),
      })
      .optional(),
  }),
});

/**
 * Blog — file-based posts in src/content/blog/. Each post is markdown
 * with frontmatter matching the schema below. `author` references the
 * authors collection.
 */
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(8).max(120),
    description: z.string().min(40).max(220),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    pillar: z.enum(['build-logs', 'studio-notes', 'distribution-diaries']),
    /** Slug of an entry in the `authors` collection. Validated at build time. */
    author: reference('authors'),
    tags: z.array(z.string()).default([]),
    hero: z.string().optional().nullable(),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog, authors };
