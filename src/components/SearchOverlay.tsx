import { useEffect, useMemo, useRef, useState } from "react";
import { useOverlayAccessibility } from "../hooks/useOverlayAccessibility";
import type { SearchablePost } from "../utils/postSearch";
import { getFilteredPosts } from "../utils/postSearch";
import styles from "./Header.module.css";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  posts: SearchablePost[];
};

export function SearchOverlay({ open, onClose, posts }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useOverlayAccessibility({
    dialogRef,
    initialFocusRef: inputRef,
    onClose,
    open,
  });

  const filteredPosts = useMemo(
    () => getFilteredPosts(posts, query),
    [posts, query],
  );

  if (!open) {
    return null;
  }

  return (
    <div className={styles.searchOverlay} role="presentation">
      <div
        className={styles.searchBackdrop}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className={styles.searchDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-search-title"
      >
        <div className={styles.searchDialogHeader}>
          <div>
            <p className={styles.searchDialogEyebrow}>Search</p>
            <h2 id="global-search-title" className={styles.searchDialogTitle}>
              블로그 글 검색
            </h2>
          </div>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="검색 닫기"
            onClick={onClose}
          >
            <span aria-hidden="true">close</span>
          </button>
        </div>

        <label className={styles.searchField} htmlFor="global-post-search">
          <span className={styles.searchFieldIcon} aria-hidden="true">
            search
          </span>
          <input
            ref={inputRef}
            id="global-post-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            className={styles.searchFieldInput}
            placeholder="Search posts…"
            aria-label="블로그 글 검색"
          />
        </label>

        <div className={styles.searchResults}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <a
                key={post.id}
                href={`/posts/${post.id}`}
                className={styles.searchResultItem}
                onClick={onClose}
              >
                <div className={styles.searchResultBody}>
                  <strong className={styles.searchResultTitle}>
                    {post.title}
                  </strong>
                  <p className={styles.searchResultDescription}>
                    {post.description}
                  </p>
                </div>
                <span className={styles.searchResultArrow} aria-hidden="true">
                  arrow_forward
                </span>
              </a>
            ))
          ) : (
            <div className={styles.searchEmptyState}>
              <p className={styles.searchEmptyEyebrow}>No results</p>
              <p className={styles.searchEmptyText}>
                다른 검색어로 다시 찾아보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
