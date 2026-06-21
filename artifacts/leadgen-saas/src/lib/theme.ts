import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.remove("light");
    root.classList.remove("dark");
  }
}

const stored = (localStorage.getItem("lf_theme") as Theme | null) ?? "dark";
applyTheme(stored);

export const useTheme = create<ThemeState>((set, get) => ({
  theme: stored,
  setTheme: (theme) => {
    localStorage.setItem("lf_theme", theme);
    applyTheme(theme);
    set({ theme });
  },
  toggle: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));
