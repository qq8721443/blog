import logo from "../assets/images/blog-logo.svg";
import { useTheme } from "../hooks/useTheme";
import { useTop } from "../hooks/useTop";
import styles from "./Header.module.css";

export function Header() {
  const isTop = useTop();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={styles.container}
      style={isTop ? undefined : { boxShadow: "var(--shadow-header-sticky)" }}
    >
      <div className={styles.content}>
        <a href="/" className={styles.logo}>
          <img src={logo.src} alt="로고" />
          <div>
            <span>jeongki</span>
            <span>.dev</span>
          </div>
        </a>
        <div className={styles.actions}>
          <button type="button" className={styles.iconButton} aria-label="검색">
            <span>search</span>
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
            <span>{theme === "dark" ? "dark_mode" : "light_mode"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
