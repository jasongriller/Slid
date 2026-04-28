import type { Config } from "tailwindcss";
import { themes, typography, spacing, grid } from "@slidesmith/schema";

const minimalMono = themes["minimal-mono"].colors;

/**
 * Token-driven Tailwind config.
 * Components must use these classes; arbitrary values are forbidden.
 */
const config: Config = {
    content: ["./index.html", "./src/**/*.{vue,ts,tsx}"],
    theme: {
        // Replace, do not extend; this enforces the strict scale.
        fontSize: {
            eyebrow: [`${typography.scale.eyebrow}px`, { lineHeight: "1.2", letterSpacing: typography.tracking.widest }],
            body: [`${typography.scale.body}px`, { lineHeight: `${typography.leading.normal}` }],
            subhead: [`${typography.scale.subhead}px`, { lineHeight: `${typography.leading.snug}` }],
            h3: [`${typography.scale.h3}px`, { lineHeight: `${typography.leading.snug}` }],
            h2: [`${typography.scale.h2}px`, { lineHeight: `${typography.leading.tight}` }],
            headline: [`${typography.scale.headline}px`, { lineHeight: `${typography.leading.tight}`, letterSpacing: typography.tracking.tight }],
        },
        spacing: Object.fromEntries(spacing.map((px) => [String(px), `${px}px`])),
        colors: {
            transparent: "transparent",
            current: "currentColor",
            // Color roles, not concrete colors. Themes set these via CSS variables.
            bg: "var(--ss-bg)",
            surface: "var(--ss-surface)",
            ink: "var(--ss-ink)",
            "ink-muted": "var(--ss-ink-muted)",
            "ink-soft": "var(--ss-ink-soft)",
            rule: "var(--ss-rule)",
            accent: "var(--ss-accent)",
            // Default fall-back values (Minimal Mono) so dev still works without a theme provider.
            mono: minimalMono,
        },
        fontFamily: {
            display: typography.family.display.split(",").map((s) => s.trim()),
            body: typography.family.body.split(",").map((s) => s.trim()),
            mono: typography.family.mono.split(",").map((s) => s.trim()),
        },
        borderRadius: { none: "0", sm: "2px" },
        boxShadow: { none: "none" },
        extend: {
            gridTemplateColumns: {
                slide: `repeat(${grid.columns}, minmax(0, 1fr))`,
            },
        },
    },
    plugins: [],
};

export default config;
