"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

// Toggles the Geist light/dark theme by stamping data-theme on <html> and
// persisting to localStorage. A no-FOUC inline script (in layout <head>)
// applies the stored choice before paint.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const t = (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "dark";
    setTheme(t);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {theme === "dark" ? <Sun weight="bold" className="size-4" /> : <Moon weight="bold" className="size-4" />}
    </button>
  );
}
