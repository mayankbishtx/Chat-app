import { persist } from "zustand/middleware";
import { create } from "zustand/react";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(persist((set) => ({
  theme: "light",
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

}),
  { name: "theme-storage" }
)); 

// theme-store is the global source of truth. It stores the current theme and the toggleTheme() function.
// Using Zustand's persist middleware, it automatically saves the theme to localStorage and restores it
// when the app reloads.