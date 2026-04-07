import type { BlogPost } from "./blogPosts";
import { formatDate } from "./formatDate";
import { getReadMinutes } from "./getReadMinutes";

export type PostDetailViewModel = {
  author: string;
  description: string;
  formattedDate: string;
  heroAlt: string;
  heroImage?: string;
  ogImage: string;
  pageTitle: string;
  primaryTag?: string;
  publishedTime: string;
  readMinutes: number;
  title: string;
  tags: string[];
};

export function toPostDetailViewModel(post: BlogPost): PostDetailViewModel {
  return {
    author: post.data.author,
    description: post.data.description,
    formattedDate: formatDate(post.data.pubDate),
    heroAlt: post.data.title,
    heroImage: post.data.heroImage,
    ogImage: post.data.heroImage ?? "/og-image.png",
    pageTitle: `${post.data.title} | jeongki.dev`,
    primaryTag: post.data.tags[0],
    publishedTime: post.data.pubDate.toISOString(),
    readMinutes: getReadMinutes(post.body || ""),
    tags: post.data.tags,
    title: post.data.title,
  };
}
