import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "../pages/index.module.css";
import {
  ALL_TAG,
  getFilteredPosts,
  type SearchablePost,
} from "../utils/postSearch";

type PostListProps = {
  posts: (SearchablePost & { pubDate: string })[];
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
    .format(new Date(date))
    .toUpperCase();

export function PostList({ posts }: PostListProps) {
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

  const filteredPosts = getFilteredPosts(posts, deferredQuery, selectedTag);

  const hasPosts = posts.length > 0;
  const hasResults = filteredPosts.length > 0;
  const hasActiveFilters = query.length > 0 || selectedTag !== ALL_TAG;

  const resetFilters = () => {
    setQuery("");
    startTransition(() => {
      setSelectedTag(ALL_TAG);
    });
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.pageTitle}>jeongki.dev 기술 블로그</h1>

      <div className={styles.searchSection}>
        <label className={styles.searchBar} htmlFor="post-search">
          <span className={styles.searchIcon} aria-hidden="true">
            search
          </span>
          <input
            id="post-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            className={styles.searchInput}
            placeholder="Search the archives…"
            aria-label="글 검색"
          />
        </label>

        <div className={styles.filterLabel}>필터</div>

        <div className={styles.chips} role="toolbar" aria-label="태그 필터">
          {tags.map((tag) => {
            const isActive = tag === selectedTag;

            return (
              <button
                key={tag}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                aria-pressed={isActive}
                onClick={() => {
                  startTransition(() => {
                    setSelectedTag(tag);
                  });
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {hasPosts && hasResults ? (
        <div className={styles.list}>
          {filteredPosts.map((post) => (
            <article key={post.id} className={styles.item}>
              <div className={styles.date}>{formatDate(post.pubDate)}</div>

              <div className={styles.body}>
                <a href={`/posts/${post.id}`} className={styles.title}>
                  {post.title}
                </a>

                <p className={styles.description}>{post.description}</p>

                <a href={`/posts/${post.id}`} className={styles.link}>
                  Read article
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyEyebrow}>
            {hasPosts ? "No matching posts" : "Archive in progress"}
          </p>
          <h2 className={styles.emptyTitle}>
            {hasPosts
              ? "조건에 맞는 글이 아직 없어요."
              : "아직 작성된 글이 없어요."}
          </h2>
          <p className={styles.emptyDescription}>
            {hasPosts
              ? "검색어를 바꾸거나 다른 태그를 선택해서 다시 찾아보세요."
              : "첫 글이 발행되면 이곳에서 최신 글과 아카이브를 확인할 수 있습니다."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              className={styles.emptyAction}
              onClick={resetFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}
