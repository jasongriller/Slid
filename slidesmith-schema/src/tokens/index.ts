/**
 * Design tokens for Slidesmith.
 *
 * Tokens are the only legal styling primitives. AI never emits raw CSS;
 * Vue components only consume values from this module (or Tailwind classes
 * generated from these tokens). Anything that is not in here is forbidden.
 */

export const SCALE_RATIO = 1.25 as const;

/** Modular typography scale at 24px body, ratio 1.25 (rounded to nearest px). */
export const typography = {
    family: {
        display: "'Inter Tight', 'Inter', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
    },
    /** Hard cap of 6 sizes. Adding more without a design review is forbidden. */
    scale: {
        eyebrow: 14,
        body: 24,
        subhead: 30,
        h3: 38,
        h2: 60,
        headline: 96,
    },
    weight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    tracking: {
        tight: "-0.02em",
        normal: "0",
        wide: "0.04em",
        widest: "0.18em",
    },
    leading: {
        tight: 1.05,
        snug: 1.15,
        normal: 1.4,
        relaxed: 1.6,
    },
} as const;

/** 8pt grid. Anything off this scale is forbidden. */
export const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

/** Color roles. Themes map roles -> hex. Minimal Mono is included by default. */
export const colorRoles = [
    "bg",
    "surface",
    "ink",
    "ink-muted",
    "ink-soft",
    "rule",
    "accent",
] as const;

export type ColorRole = (typeof colorRoles)[number];

export const themes = {
    "minimal-mono": {
        id: "minimal-mono",
        name: "Minimal Mono",
        colors: {
            bg: "#FFFFFF",
            surface: "#F7F7F7",
            ink: "#0A0A0A",
            "ink-muted": "#1F1F1F",
            "ink-soft": "#6B6B6B",
            rule: "#E5E5E5",
            accent: "#0A0A0A",
        },
        radii: { sm: 0, md: 2, lg: 2 },
        shadows: { sm: "none", md: "none", lg: "none" },
        flourishes: { allowGradients: false, allowGeometric: false },
    },
} as const;

export type ThemeId = keyof typeof themes;

/** 12-col grid at 1920x1080 with 64px gutters and 160px outside margins. */
export const grid = {
    canvas: { width: 1920, height: 1080 },
    columns: 12,
    gutter: 64,
    margin: 160,
} as const;

export const tokens = {
    typography,
    spacing,
    colorRoles,
    themes,
    grid,
} as const;

/**
 * Validate that a numeric pixel value lies on the spacing scale.
 * Used by tests and (optionally) at runtime when consuming AI output.
 */
export const isSpacingValue = (px: number): boolean =>
    (spacing as readonly number[]).includes(px);

/**
 * Validate that a font-size value lies on the typography scale.
 */
export const isTypographyScale = (px: number): boolean =>
    (Object.values(typography.scale) as number[]).includes(px);

/**
 * Compute a scale step from the body size.
 * Used to derive non-token sizes during regression tests.
 */
export const scaleFromBody = (steps: number): number =>
    Math.round(typography.scale.body * Math.pow(SCALE_RATIO, steps));
