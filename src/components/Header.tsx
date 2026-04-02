import { useEffect, useMemo, useState } from "react";
import logo from "../assets/images/blog-logo.svg";
import { useTheme } from "../hooks/useTheme";
import { useTop } from "../hooks/useTop";
import type { SearchablePost } from "../utils/postSearch";
import styles from "./Header.module.css";
import { SearchOverlay } from "./SearchOverlay";

type HeaderProps = {
  posts: SearchablePost[];
};

export function Header({ posts }: HeaderProps) {
  const isTop = useTop();
  const { theme, toggleTheme } = useTheme();
  const [pathname, setPathname] = useState("/");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const isHomePage = useMemo(() => pathname === "/", [pathname]);

  const handleSearchTrigger = () => {
    if (isHomePage) {
      const input = document.getElementById("post-search");

      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      input.focus();
      input.scrollIntoView({ block: "start", behavior: "smooth" });
      window.setTimeout(() => {
        window.scrollBy({ top: -96, behavior: "instant" });
      }, 0);
      return;
    }

    setIsSearchOpen(true);
  };

  return (
    <>
      <header
        className={styles.container}
        style={isTop ? undefined : { boxShadow: "var(--shadow-header-sticky)" }}
      >
        <div className={styles.content}>
          <a href="/" className={styles.logo}>
            <img src={logo.src} alt="로고" width="32" height="32" />
            <div>
              <span>jeongki</span>
              <span>.dev</span>
            </div>
          </a>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={isHomePage ? "검색으로 이동" : "검색 열기"}
              onClick={handleSearchTrigger}
            >
              <span aria-hidden="true">search</span>
              <span className={styles.srOnly}>
                {isHomePage ? "검색으로 이동" : "검색 열기"}
              </span>
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={
                theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
              }
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              <span aria-hidden="true">
                {theme === "dark" ? "dark_mode" : "light_mode"}
              </span>
            </button>
          </div>
        </div>
      </header>
      <SearchOverlay
        open={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
        }}
        posts={posts}
      />
    </>
  );
}
