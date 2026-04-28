import { themes, type ThemeId } from "@slidesmith/schema";

/**
 * Apply a theme by writing its color roles as CSS variables on :root.
 * Tailwind reads these via `var(--ss-*)` so a single update repaints the deck.
 */
export const applyTheme = (themeId: ThemeId, accentOverride?: string): void => {
    const theme = themes[themeId];
    const root = document.documentElement;
    for (const [role, hex] of Object.entries(theme.colors)) {
        root.style.setProperty(`--ss-${role}`, hex);
    }
    if (accentOverride) {
        root.style.setProperty("--ss-accent", accentOverride);
    }
};

/**
 * Compute the inline style object for a slide-canvas element so it
 * always renders at exactly 1920×1080 regardless of viewport zoom.
 */
export const canvasStyle = () => ({
    width: "1920px",
    height: "1080px",
    position: "relative" as const,
    overflow: "hidden" as const,
});

/**
 * Compute the scale factor needed to fit a 1920×1080 canvas into a viewport.
 * Pure helper: separated so it can be unit-tested.
 */
export const fitScale = (viewportWidth: number, viewportHeight: number): number => {
    const sx = viewportWidth / 1920;
    const sy = viewportHeight / 1080;
    return Math.max(0, Math.min(sx, sy));
};
