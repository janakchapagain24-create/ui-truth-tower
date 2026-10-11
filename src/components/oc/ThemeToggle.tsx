import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);
  useEffect(() => setLight(document.documentElement.classList.contains("light")), []);
  const toggle = () => {
    const next = !light;
    const el = document.documentElement;
    el.classList.toggle("light", next);
    el.classList.toggle("dark", !next);
    try { localStorage.setItem("oc-theme", next ? "light" : "dark"); } catch { /* ignore */ }
    setLight(next);
  };
  return (
    <button onClick={toggle} aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className={`glass grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-secondary ${className}`}>
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
