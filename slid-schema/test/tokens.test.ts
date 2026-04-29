import {
    SCALE_RATIO,
    isSpacingValue,
    isTypographyScale,
    scaleFromBody,
    spacing,
    themes,
    tokens,
    typography,
} from "../src/tokens/index.js";

describe("tokens", () => {
    test("typography scale enforces a hard cap of 6 sizes", () => {
        expect(Object.keys(typography.scale)).toHaveLength(6);
    });

    test("8pt grid is monotonically increasing", () => {
        for (let i = 1; i < spacing.length; i++) {
            expect(spacing[i]).toBeGreaterThan(spacing[i - 1]!);
        }
    });

    test("Minimal Mono forbids shadows and flourishes", () => {
        const minimalMono = themes["minimal-mono"];
        expect(minimalMono.shadows.sm).toBe("none");
        expect(minimalMono.shadows.md).toBe("none");
        expect(minimalMono.shadows.lg).toBe("none");
        expect(minimalMono.flourishes.allowGradients).toBe(false);
        expect(minimalMono.flourishes.allowGeometric).toBe(false);
    });

    test("isSpacingValue accepts scale members and rejects others", () => {
        expect(isSpacingValue(8)).toBe(true);
        expect(isSpacingValue(9)).toBe(false);
        expect(isSpacingValue(128)).toBe(true);
    });

    test("isTypographyScale accepts scale members and rejects others", () => {
        expect(isTypographyScale(typography.scale.headline)).toBe(true);
        expect(isTypographyScale(13)).toBe(false);
    });

    test("scaleFromBody applies the modular ratio", () => {
        expect(SCALE_RATIO).toBeCloseTo(1.25);
        expect(scaleFromBody(0)).toBe(typography.scale.body);
        expect(scaleFromBody(1)).toBe(Math.round(typography.scale.body * SCALE_RATIO));
        expect(scaleFromBody(-1)).toBe(Math.round(typography.scale.body / SCALE_RATIO));
    });

    test("tokens barrel exposes typography, spacing, themes and grid", () => {
        expect(tokens.typography).toBe(typography);
        expect(tokens.spacing).toBe(spacing);
        expect(tokens.themes).toBe(themes);
        expect(tokens.grid.canvas.width).toBe(1920);
        expect(tokens.grid.canvas.height).toBe(1080);
        expect(tokens.colorRoles).toContain("accent");
    });
});
