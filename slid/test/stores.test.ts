import { setActivePinia, createPinia } from "pinia";
import { useDeckStore } from "../src/stores/deck";
import { fitScale } from "../src/design/theme";
import type { Deck } from "@slid/schema";

const baseDeck: Deck = {
    id: "test-deck",
    title: "Test deck",
    theme: "minimal-mono",
    slides: [
        { layout: "cover", title: "First" },
        { layout: "cover", title: "Second" },
        { layout: "cover", title: "Third" },
    ],
};

describe("deck store", () => {
    beforeEach(() => setActivePinia(createPinia()));

    test("setDeck initializes state and clears history", () => {
        const store = useDeckStore();
        store.setDeck(baseDeck);
        expect(store.deck?.title).toBe("Test deck");
        expect(store.selectedSlide).toBe(0);
        expect(store.canUndo).toBe(false);
    });

    test("replaceSlide pushes onto undo stack", () => {
        const store = useDeckStore();
        store.setDeck(baseDeck);
        store.replaceSlide(1, { layout: "cover", title: "Second (new)" });
        expect(store.deck?.slides[1]?.layout).toBe("cover");
        expect((store.deck?.slides[1] as any).title).toBe("Second (new)");
        expect(store.canUndo).toBe(true);
    });

    test("undo and redo restore previous state", () => {
        const store = useDeckStore();
        store.setDeck(baseDeck);
        store.replaceSlide(0, { layout: "cover", title: "Changed" });
        store.undo();
        expect((store.deck?.slides[0] as any).title).toBe("First");
        store.redo();
        expect((store.deck?.slides[0] as any).title).toBe("Changed");
    });

    test("reorderSlides moves a slide", () => {
        const store = useDeckStore();
        store.setDeck(baseDeck);
        store.reorderSlides(0, 2);
        expect((store.deck?.slides[2] as any).title).toBe("First");
    });

    test("select clamps to valid range", () => {
        const store = useDeckStore();
        store.setDeck(baseDeck);
        store.select(99);
        expect(store.selectedSlide).toBe(2);
        store.select(-1);
        expect(store.selectedSlide).toBe(0);
    });
});

describe("fitScale", () => {
    test("scales down when viewport is smaller than canvas", () => {
        expect(fitScale(960, 540)).toBeCloseTo(0.5);
    });
    test("returns 0 when a dimension is zero", () => {
        expect(fitScale(0, 1080)).toBe(0);
    });
});
