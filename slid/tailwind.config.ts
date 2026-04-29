import type { Config } from "tailwindcss";
import { themes, typography, spacing, grid } from "@slid/schema";

const minimalMono = themes["minimal-mono"].colors;

/**
 * Token-driven Tailwind config with extended utilities for modern dark theme.
 */
const config: Config = {
    content: ["./index.html", "./src/**/*.{vue,ts,tsx}"],
    theme: {
        fontSize: {
            xs: ["12px", { lineHeight: "1.4" }],
            sm: ["14px", { lineHeight: "1.5" }],
            base: ["16px", { lineHeight: "1.6" }],
            lg: ["18px", { lineHeight: "1.5" }],
            xl: ["20px", { lineHeight: "1.4" }],
            "2xl": ["24px", { lineHeight: "1.3" }],
            "3xl": ["32px", { lineHeight: "1.2" }],
            "4xl": ["40px", { lineHeight: "1.1" }],
            "5xl": ["56px", { lineHeight: "1.05" }],
            "6xl": ["72px", { lineHeight: "1" }],
            // Legacy schema-based sizes
            eyebrow: [`${typography.scale.eyebrow}px`, { lineHeight: "1.2", letterSpacing: typography.tracking.widest }],
            body: [`${typography.scale.body}px`, { lineHeight: `${typography.leading.normal}` }],
            subhead: [`${typography.scale.subhead}px`, { lineHeight: `${typography.leading.snug}` }],
            h5: ["18px", { lineHeight: "1.3" }],
            h4: ["24px", { lineHeight: "1.25" }],
            h3: [`${typography.scale.h3}px`, { lineHeight: `${typography.leading.snug}` }],
            h2: [`${typography.scale.h2}px`, { lineHeight: `${typography.leading.tight}` }],
            headline: [`${typography.scale.headline}px`, { lineHeight: `${typography.leading.tight}`, letterSpacing: typography.tracking.tight }],
        },
        spacing: {
            ...Object.fromEntries(spacing.map((px) => [String(px), `${px}px`])),
            // Additional spacing values
            "0": "0",
            "1": "4px",
            "2": "8px",
            "3": "12px",
            "4": "16px",
            "5": "20px",
            "6": "24px",
            "7": "28px",
            "8": "32px",
            "10": "40px",
            "12": "48px",
            "14": "56px",
            "16": "64px",
            "20": "80px",
            "24": "96px",
            "28": "112px",
            "32": "128px",
            "40": "160px",
            "48": "192px",
            "56": "224px",
            "64": "256px",
        },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            white: "#FFFFFF",
            black: "#000000",
            // Theme color roles via CSS variables
            bg: "var(--ss-bg)",
            "bg-secondary": "var(--ss-bg-secondary)",
            surface: "var(--ss-surface)",
            "surface-elevated": "var(--ss-surface-elevated)",
            ink: "var(--ss-ink)",
            "ink-muted": "var(--ss-ink-muted)",
            "ink-soft": "var(--ss-ink-soft)",
            rule: "var(--ss-rule)",
            accent: "var(--ss-accent)",
            "accent-secondary": "var(--ss-accent-secondary)",
            // Glass colors
            glass: {
                bg: "var(--ss-glass-bg)",
                border: "var(--ss-glass-border)",
            },
            // Default fall-back values (Minimal Mono)
            mono: minimalMono,
        },
        fontFamily: {
            display: typography.family.display.split(",").map((s) => s.trim()),
            body: typography.family.body.split(",").map((s) => s.trim()),
            mono: typography.family.mono.split(",").map((s) => s.trim()),
        },
        borderRadius: {
            none: "0",
            sm: "4px",
            DEFAULT: "8px",
            md: "12px",
            lg: "16px",
            xl: "20px",
            "2xl": "24px",
            "3xl": "32px",
            full: "9999px",
        },
        boxShadow: {
            none: "none",
            sm: "var(--ss-shadow-sm)",
            DEFAULT: "var(--ss-shadow-md)",
            md: "var(--ss-shadow-md)",
            lg: "var(--ss-shadow-lg)",
            glow: "var(--ss-shadow-glow)",
            "glow-accent": "var(--ss-shadow-glow-accent)",
        },
        backdropBlur: {
            none: "0",
            sm: "4px",
            DEFAULT: "8px",
            md: "12px",
            lg: "16px",
            xl: "24px",
            "2xl": "40px",
            "3xl": "64px",
        },
        extend: {
            gridTemplateColumns: {
                slide: `repeat(${grid.columns}, minmax(0, 1fr))`,
            },
            backgroundImage: {
                "gradient-primary": "var(--ss-gradient-primary)",
                "gradient-subtle": "var(--ss-gradient-subtle)",
                "gradient-glow": "var(--ss-gradient-glow)",
                "gradient-mesh": "var(--ss-gradient-mesh)",
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
            animation: {
                "float": "float 6s ease-in-out infinite",
                "pulse-glow": "pulse-glow 3s ease-in-out infinite",
                "gradient-shift": "gradient-shift 8s ease infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                },
                "gradient-shift": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
            },
            transitionDuration: {
                "fast": "150ms",
                "base": "250ms",
                "slow": "400ms",
            },
            transitionTimingFunction: {
                "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        },
    },
    plugins: [],
};

export default config;
