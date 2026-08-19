import { useCallback, useEffect, useState } from "react";

const KEY = "siteiq-theme";

/** Single theme system shared by the landing page and the report workspace. */
export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    const prefers =
      stored === "dark" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefers);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((d) => {
      window.localStorage.setItem(KEY, d ? "light" : "dark");
      return !d;
    });
  }, []);

  return { dark, toggle };
}
