import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Slide } from "@slid/schema";
import type { Suggestion, SuggestionsResponse } from "../ai/suggestions";
import { suggestImprovements } from "../ai/suggestions";

interface SuggestionsState {
    suggestions: Suggestion[];
    isLoading: boolean;
    error: string | null;
    lastFetch: {
        slideIndex: number;
        deckId: string;
    } | null;
    acceptedIds: Set<string>;
    rejectedIds: Set<string>;
}

export const useSuggestionsStore = defineStore("suggestions", () => {
    const suggestions = ref<Suggestion[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const lastFetch = ref<{ slideIndex: number; deckId: string } | null>(null);
    const acceptedIds = ref(new Set<string>());
    const rejectedIds = ref(new Set<string>());

    // Computed getters
    const activeSuggestions = computed(() =>
        suggestions.value.filter((s) => !acceptedIds.value.has(s.id) && !rejectedIds.value.has(s.id)),
    );

    const byType = computed(() => ({
        layout: activeSuggestions.value.filter((s) => s.type === "layout"),
        content: activeSuggestions.value.filter((s) => s.type === "content"),
        design: activeSuggestions.value.filter((s) => s.type === "design"),
    }));

    // Actions
    const fetchSuggestions = async (deckId: string, slideIndex: number, slide: unknown) => {
        if (lastFetch.value?.slideIndex === slideIndex && lastFetch.value?.deckId === deckId) {
            return; // Skip if we just fetched for this slide
        }

        isLoading.value = true;
        error.value = null;

        try {
            const response = await suggestImprovements(deckId, slideIndex, slide as Slide);
            suggestions.value = response.suggestions;
            lastFetch.value = { slideIndex, deckId };
            acceptedIds.value.clear();
            rejectedIds.value.clear();
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Failed to fetch suggestions";
            suggestions.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const acceptSuggestion = (id: string) => {
        acceptedIds.value.add(id);
        rejectedIds.value.delete(id);
    };

    const rejectSuggestion = (id: string) => {
        rejectedIds.value.add(id);
        acceptedIds.value.delete(id);
    };

    const clearSuggestions = () => {
        suggestions.value = [];
        acceptedIds.value.clear();
        rejectedIds.value.clear();
        lastFetch.value = null;
        error.value = null;
    };

    return {
        suggestions,
        isLoading,
        error,
        activeSuggestions,
        byType,
        fetchSuggestions,
        acceptSuggestion,
        rejectSuggestion,
        clearSuggestions,
    };
});
