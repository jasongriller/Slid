import {
    isLayoutId,
    layoutIds,
    layoutRegistry,
    pickLayout,
} from "../src/layouts/index.js";

describe("layout registry", () => {
    test("registry has at least 20 layouts", () => {
        expect(layoutIds.length).toBeGreaterThanOrEqual(20);
    });

    test("every entry's id matches its key", () => {
        for (const [key, meta] of Object.entries(layoutRegistry)) {
            expect(meta.id).toBe(key);
            expect(meta.label.length).toBeGreaterThan(0);
            expect(meta.description.length).toBeGreaterThan(0);
            expect(meta.suitableFor.length).toBeGreaterThan(0);
        }
    });

    test("isLayoutId is true only for known ids", () => {
        expect(isLayoutId("cover")).toBe(true);
        expect(isLayoutId("not-a-layout")).toBe(false);
    });
});

describe("pickLayout", () => {
    test("picks an image-supporting layout when an image is provided", () => {
        const result = pickLayout({ contentType: "narrative", hasImage: true });
        expect(result.id).toBe("split-hero");
        expect(layoutRegistry[result.id]!.supportsImage).toBe(true);
    });

    test("picks first registry match when no image is provided", () => {
        const result = pickLayout({ contentType: "narrative" });
        expect(result.reason).toMatch(/first registry match/);
    });

    test("respects bullet caps", () => {
        const ok = pickLayout({ contentType: "list", bulletCount: 3 });
        expect(ok.reason).toMatch(/bullet count cap/);
        expect(layoutRegistry[ok.id]!.suitableFor).toContain("list");
    });

    test("respects item caps", () => {
        const ok = pickLayout({ contentType: "agenda", itemCount: 5 });
        expect(ok.reason).toMatch(/item count cap/);
    });

    test("falls back to callout-card when no layout suits the content type", () => {
        // @ts-expect-error testing a deliberately invalid content type
        const fallback = pickLayout({ contentType: "definitely-not-a-thing" });
        expect(fallback.id).toBe("callout-card");
        expect(fallback.reason).toMatch(/no exact match/);
    });

    test("ignores hasImage when no candidate supports images", () => {
        const result = pickLayout({ contentType: "stat", hasImage: true });
        // stat-callout does not support images, so we still get a stat-suitable layout
        expect(["stat-callout", "data-viz", "metrics"]).toContain(result.id);
    });

    test("falls through bullet and item caps when caps are exceeded by all candidates", () => {
        const result = pickLayout({ contentType: "list", bulletCount: 9999, itemCount: 9999 });
        expect(result.reason).toMatch(/first registry match/);
    });
});
