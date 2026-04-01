import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

const getEffectiveTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = document.documentElement.dataset.theme;
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => {
      if (document.documentElement.dataset.theme) {
        setTheme(getEffectiveTheme());
        return;
      }

      setTheme(mediaQuery.matches ? "dark" : "light");
    };

    syncTheme();

    const handleChange = () => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        syncTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  return { theme, toggleTheme };
}
