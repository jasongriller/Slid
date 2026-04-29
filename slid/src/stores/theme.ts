import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
    // Check for saved preference or system preference
    const getInitialTheme = (): "light" | "dark" => {
        const saved = localStorage.getItem("slid-theme");
        if (saved === "light" || saved === "dark") {
            return saved;
        }
        // Check system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
        return "light";
    };

    const theme = ref<"light" | "dark">(getInitialTheme());
    const isDark = ref(theme.value === "dark");

    // Apply theme to document
    const applyTheme = (newTheme: "light" | "dark") => {
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("slid-theme", newTheme);
    };

    // Toggle theme
    const toggleTheme = () => {
        theme.value = theme.value === "light" ? "dark" : "light";
        isDark.value = theme.value === "dark";
        applyTheme(theme.value);
    };

    // Set specific theme
    const setTheme = (newTheme: "light" | "dark") => {
        theme.value = newTheme;
        isDark.value = newTheme === "dark";
        applyTheme(newTheme);
    };

    // Watch for changes and apply
    watch(theme, (newTheme) => {
        applyTheme(newTheme);
    }, { immediate: true });

    // Listen for system preference changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("slid-theme")) {
            setTheme(e.matches ? "dark" : "light");
        }
    });

    return {
        theme,
        isDark,
        toggleTheme,
        setTheme,
    };
});
