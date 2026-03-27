import logo from "../assets/images/blog-logo.svg";
import { useTop } from "../hooks/useTop";
import styles from "./Header.module.css";

export function Header() {
  const isTop = useTop();

  return (
    <div
      className={styles.container}
      style={isTop ? undefined : { boxShadow: "0 1px 1px #eee" }}
    >
      <div className={styles.content}>
        <div className={styles.logo}>
          <img src={logo.src} alt="로고" />
          <div>
            <span>jeongki</span>
            <span>.dev</span>
          </div>
        </div>
        <div>
          <button type="button" className={styles.search}>
            <span>search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
