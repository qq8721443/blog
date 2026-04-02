import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchablePost } from "../utils/postSearch";
import { getFilteredPosts } from "../utils/postSearch";
import styles from "./Header.module.css";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  posts: SearchablePost[];
};

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.dataset.focusGuard !== "true" &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

export function SearchOverlay({ open, onClose, posts }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const inertTargets = Array.from(
      document.querySelectorAll<HTMLElement>("header, main, footer, .skipLink"),
    );
    const previousInertStates = inertTargets.map((element) =>
      element.hasAttribute("inert"),
    );

    document.body.style.overflow = "hidden";
    inertTargets.forEach((element) => {
      element.setAttribute("inert", "");
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      inertTargets.forEach((element, index) => {
        if (previousInertStates[index]) {
          element.setAttribute("inert", "");
          return;
        }

        element.removeAttribute("inert");
      });
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements = getFocusableElements(dialog);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const currentIndex = activeElement
        ? focusableElements.indexOf(activeElement)
        : -1;
      const nextIndex = event.shiftKey
        ? currentIndex <= 0
          ? focusableElements.length - 1
          : currentIndex - 1
        : currentIndex === -1 || currentIndex === focusableElements.length - 1
          ? 0
          : currentIndex + 1;

      event.preventDefault();
      focusableElements[nextIndex]?.focus();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const target = event.target instanceof HTMLElement ? event.target : null;

      if (target && dialog.contains(target)) {
        return;
      }

      const focusableElements = getFocusableElements(dialog);
      focusableElements[0]?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      previousFocusedElementRef.current?.focus();
    };
  }, [open, onClose]);

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
