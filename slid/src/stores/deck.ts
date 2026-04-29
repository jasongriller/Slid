import { defineStore } from "pinia";
import type { Deck, Slide } from "@slid/schema";

interface DeckState {
    deck: Deck | null;
    selectedSlide: number;
    past: Deck[];
    future: Deck[];
}

const HISTORY_LIMIT = 100;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const useDeckStore = defineStore("deck", {
    state: (): DeckState => ({
        deck: null,
        selectedSlide: 0,
        past: [],
        future: [],
    }),
    getters: {
        currentSlide(state): Slide | null {
            return state.deck?.slides[state.selectedSlide] ?? null;
        },
        canUndo: (state) => state.past.length > 0,
        canRedo: (state) => state.future.length > 0,
    },
    actions: {
        setDeck(deck: Deck) {
            this.deck = clone(deck);
            this.selectedSlide = 0;
            this.past = [];
            this.future = [];
        },
        select(index: number) {
            if (!this.deck) return;
            this.selectedSlide = Math.max(0, Math.min(this.deck.slides.length - 1, index));
        },
        /** Snapshot the current deck onto the undo stack. */
        commit() {
            if (!this.deck) return;
            this.past.push(clone(this.deck));
            if (this.past.length > HISTORY_LIMIT) this.past.shift();
            this.future = [];
        },
        replaceSlide(index: number, slide: Slide) {
            if (!this.deck) return;
            this.commit();
            const slides = [...this.deck.slides];
            slides[index] = clone(slide);
            this.deck = { ...this.deck, slides };
        },
        reorderSlides(from: number, to: number) {
            if (!this.deck) return;
            if (from === to) return;
            this.commit();
            const slides = [...this.deck.slides];
            const [moved] = slides.splice(from, 1);
            if (!moved) return;
            slides.splice(to, 0, moved);
            this.deck = { ...this.deck, slides };
        },
        undo() {
            if (!this.deck || this.past.length === 0) return;
            const previous = this.past.pop()!;
            this.future.push(clone(this.deck));
            this.deck = previous;
        },
        redo() {
            if (!this.deck || this.future.length === 0) return;
            const next = this.future.pop()!;
            this.past.push(clone(this.deck));
            this.deck = next;
        },
    },
});
