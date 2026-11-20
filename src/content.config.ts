import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.string().regex(/^[a-z]{2}$/),
    order: z.number().int(),
    draft: z.boolean(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
  }),
});

export const collections = { articles };
