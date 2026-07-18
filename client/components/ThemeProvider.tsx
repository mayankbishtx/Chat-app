"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {

    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <>
            {children}
        </>
    );
}   

// ThemeProvider listens for changes in the theme from the Zustand store and 
// updates the <html> element by adding or removing the dark class.