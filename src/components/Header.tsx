import { useCallback, useEffect, useState } from "react";
import logo from "../assets/images/blog-logo.svg";
import styles from "./Header.module.css";

export function Header() {
  const [isTop, setIsTop] = useState(true);

  const handleScroll = useCallback(() => {
    if (window.scrollY !== 0) {
      setIsTop(false);
    } else {
      setIsTop(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

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
