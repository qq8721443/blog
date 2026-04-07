import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ALL_TAG,
  getFilteredPosts,
  type SearchablePost,
} from "../utils/postSearch";

type UsePostSearchProps<T extends SearchablePost> = {
  posts: T[];
};

export function usePostSearch<T extends SearchablePost>({
  posts,
}: UsePostSearchProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(ALL_TAG);
  const [isSearchParamsReady, setIsSearchParamsReady] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const tags = useMemo(
    () => [ALL_TAG, ...new Set(posts.flatMap((post) => post.tags))],
    [posts],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextQuery = params.get("q") ?? "";
    const nextTag = params.get("tag");

    setQuery(nextQuery);

    if (nextTag && tags.includes(nextTag)) {
      setSelectedTag(nextTag);
    }

    setIsSearchParamsReady(true);
  }, [tags]);

  useEffect(() => {
    if (!isSearchParamsReady) {
      return;
    }

    const url = new URL(window.location.href);

    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }

    if (selectedTag !== ALL_TAG) {
      url.searchParams.set("tag", selectedTag);
    } else {
      url.searchParams.delete("tag");
    }

    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [isSearchParamsReady, query, selectedTag]);

  const filteredPosts = useMemo(
    () => getFilteredPosts(posts, deferredQuery, selectedTag),
    [deferredQuery, posts, selectedTag],
  );

  const hasActiveFilters = query.length > 0 || selectedTag !== ALL_TAG;

  const resetFilters = () => {
    setQuery("");
    startTransition(() => {
      setSelectedTag(ALL_TAG);
    });
  };

  return {
    query,
    setQuery,
    selectedTag,
    setSelectedTag,
    tags,
    filteredPosts,
    hasActiveFilters,
    resetFilters,
  };
}
