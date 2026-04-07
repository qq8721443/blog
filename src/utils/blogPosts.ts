import { type CollectionEntry, getCollection } from "astro:content";
import type { SearchablePost } from "./postSearch";

type BlogPost = CollectionEntry<"blog">;

export type PostListItem = SearchablePost & {
  pubDate: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export function toSearchablePosts(posts: BlogPost[]): SearchablePost[] {
  return posts.map((post) => ({
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
  }));
}

export function toPostListItems(posts: BlogPost[]): PostListItem[] {
  return posts.map((post) => ({
    ...toSearchablePosts([post])[0],
    pubDate: post.data.pubDate.toISOString(),
  }));
}
