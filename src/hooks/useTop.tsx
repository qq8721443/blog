import { useCallback, useEffect, useState } from "react";

export function useTop() {
  const [isTop, setIsTop] = useState(true);

  const handleScroll = useCallback(() => {
    const { scrollY } = window;
    if (scrollY === 0) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return isTop;
}
