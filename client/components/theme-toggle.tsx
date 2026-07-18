"use client";
import { useThemeStore } from "@/store/theme-store";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();
    const audioRef = useRef(new Audio("/sounds/electic_button.mp3"));

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    function playAudio() {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }

    function handleToggle() {
        toggleTheme();
        playAudio();
    }

    return (
        <button
            onClick={handleToggle}
            className="fixed top-8 right-8 px-2 py-2 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer dark:text-white"
        >
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}

// only changes the theme value in the Zustand store