import { disassemble, getChoseong } from "es-hangul";

export type SearchablePost = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

export const ALL_TAG = "All";

const normalize = (value: string) => value.trim().toLowerCase();
const disassembleText = (value: string) => disassemble(normalize(value));
const choseongText = (value: string) => getChoseong(normalize(value));

const matchesSearch = (value: string, query: string) => {
  const normalizedValue = normalize(value);

  if (normalizedValue.includes(query)) {
    return true;
  }

  const disassembledQuery = disassembleText(query);
  if (disassembledQuery && disassembleText(value).includes(disassembledQuery)) {
    return true;
  }

  const choseongQuery = choseongText(query);
  return Boolean(choseongQuery && choseongText(value).includes(choseongQuery));
};

export function getFilteredPosts<T extends SearchablePost>(
  posts: T[],
  query: string,
  selectedTag = ALL_TAG,
): T[] {
  const normalizedQuery = normalize(query);

  return posts.filter((post) => {
    const matchesTag =
      selectedTag === ALL_TAG || post.tags.includes(selectedTag);

    if (!matchesTag) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = normalize(
      [post.title, post.description, ...post.tags].join(" "),
    );

    return matchesSearch(searchableText, normalizedQuery);
  });
}
