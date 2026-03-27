import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <div>© 2026 jeongki dev.</div>
        <ul className={styles.list}>
          <li>
            <a href="https://github.com/qq8721443">GitHub</a>
          </li>
          <li>
            <a href="mailto:qq8721443@naver.com">Email</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
