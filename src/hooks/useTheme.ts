"use client";
import { useState, useEffect } from "react";
import type { Theme } from "@/utils/theme";
import { darkVars, lightVars } from "@/utils/theme";

export function useTheme() {
  // Initialize theme from localStorage or system preference to avoid
  // setting state inside an effect (causes cascading renders).
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("nexus-theme") as Theme | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply CSS variables to :root whenever theme changes and persist preference
  useEffect(() => {
    const vars = theme === "dark" ? darkVars : lightVars;
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Add data attribute for potential CSS selectors
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("nexus-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}