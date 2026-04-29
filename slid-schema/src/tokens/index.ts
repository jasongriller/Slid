/**
 * Design tokens for Slid.
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
    "editorial": {
        id: "editorial",
        name: "Editorial",
        colors: {
            bg: "#FFFEF8",
            surface: "#F5F3EB",
            ink: "#1A1A1A",
            "ink-muted": "#3D3D3D",
            "ink-soft": "#7A7A7A",
            rule: "#E8E4D9",
            accent: "#C41E3A",
        },
        radii: { sm: 0, md: 0, lg: 0 },
        shadows: { sm: "none", md: "none", lg: "none" },
        flourishes: { allowGradients: false, allowGeometric: false },
    },
    "bold-modern": {
        id: "bold-modern",
        name: "Bold Modern",
        colors: {
            bg: "#0D0D0D",
            surface: "#1A1A1A",
            ink: "#FFFFFF",
            "ink-muted": "#E5E5E5",
            "ink-soft": "#999999",
            rule: "#333333",
            accent: "#FF3366",
        },
        radii: { sm: 4, md: 8, lg: 16 },
        shadows: {
            sm: "0 2px 4px rgba(0,0,0,0.3)",
            md: "0 4px 12px rgba(0,0,0,0.4)",
            lg: "0 8px 24px rgba(0,0,0,0.5)",
        },
        flourishes: { allowGradients: true, allowGeometric: true },
    },
    "corporate-refined": {
        id: "corporate-refined",
        name: "Corporate Refined",
        colors: {
            bg: "#FAFBFC",
            surface: "#FFFFFF",
            ink: "#24292E",
            "ink-muted": "#444D56",
            "ink-soft": "#6A737D",
            rule: "#E1E4E8",
            accent: "#0366D6",
        },
        radii: { sm: 2, md: 4, lg: 6 },
        shadows: {
            sm: "0 1px 2px rgba(0,0,0,0.05)",
            md: "0 2px 8px rgba(0,0,0,0.08)",
            lg: "0 4px 16px rgba(0,0,0,0.1)",
        },
        flourishes: { allowGradients: false, allowGeometric: false },
    },
    "tech-gradient": {
        id: "tech-gradient",
        name: "Tech Gradient",
        colors: {
            bg: "#0F0F1A",
            surface: "#1A1A2E",
            ink: "#EAEAEA",
            "ink-muted": "#C5C5C5",
            "ink-soft": "#8888A0",
            rule: "#2D2D44",
            accent: "#6C63FF",
        },
        radii: { sm: 6, md: 12, lg: 20 },
        shadows: {
            sm: "0 2px 8px rgba(108,99,255,0.15)",
            md: "0 4px 16px rgba(108,99,255,0.2)",
            lg: "0 8px 32px rgba(108,99,255,0.25)",
        },
        flourishes: { allowGradients: true, allowGeometric: true },
    },
    "swiss-grid": {
        id: "swiss-grid",
        name: "Swiss Grid",
        colors: {
            bg: "#FFFFFF",
            surface: "#F0F0F0",
            ink: "#000000",
            "ink-muted": "#333333",
            "ink-soft": "#666666",
            rule: "#CCCCCC",
            accent: "#FF0000",
        },
        radii: { sm: 0, md: 0, lg: 0 },
        shadows: { sm: "none", md: "none", lg: "none" },
        flourishes: { allowGradients: false, allowGeometric: true },
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
