import { getCollection, type CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"articles">;

export async function loadArticles(lang: string): Promise<Article[]> {
  const all = await getCollection("articles", ({ data }) => data.lang === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}
