"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ICON_SIZE = 18;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveTheme = mounted
    ? theme === "system"
      ? resolvedTheme
      : theme
    : null;
  const isDark = effectiveTheme === "dark";

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="theme-toggle"
    >
      <span className="sr-only">Toggle theme</span>
      <svg
        aria-hidden="true"
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 24 24"
        className="theme-toggle__icon"
        data-variant="sun"
  style={{ opacity: mounted ? (isDark ? 0 : 1) : 0, visibility: mounted ? "visible" : "hidden" }}
      >
        <path
          fill="currentColor"
          d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM4.22 5.64a1 1 0 0 1 1.42 0l.7.7a1 1 0 0 1-1.42 1.42l-.7-.7a1 1 0 0 1 0-1.42zM17.66 19.08a1 1 0 0 1 1.41 0l.71.7a1 1 0 0 1-1.42 1.42l-.7-.71a1 1 0 0 1 0-1.41zM2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm18 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1zm-1.08-6.36a1 1 0 0 1 0 1.42l-.7.7a1 1 0 0 1-1.42-1.42l.7-.7a1 1 0 0 1 1.42 0zM6.34 17.66a1 1 0 0 1 0 1.42l-.7.7a1 1 0 1 1-1.42-1.42l.7-.7a1 1 0 0 1 1.42 0z"
        />
      </svg>
      <svg
        aria-hidden="true"
        width={ICON_SIZE}
        height={ICON_SIZE}
        viewBox="0 0 24 24"
        className="theme-toggle__icon"
        data-variant="moon"
  style={{ opacity: mounted ? (isDark ? 1 : 0) : 0, visibility: mounted ? "visible" : "hidden" }}
      >
        <path
          fill="currentColor"
          d="M21 13.35a9 9 0 0 1-10.35-10.3A1 1 0 0 0 9.3 2 10.98 10.98 0 1 0 22 14.7a1 1 0 0 0-1-1.35z"
        />
      </svg>
    </button>
  );
}
