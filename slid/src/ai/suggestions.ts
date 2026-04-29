import type { Slide } from "@slid/schema";

export interface SuggestionItem {
    id: string;
    type: "layout" | "content" | "design";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    action: SuggestionAction;
}

export interface LayoutSuggestion extends SuggestionItem {
    type: "layout";
    action: LayoutAction;
}

export interface ContentSuggestion extends SuggestionItem {
    type: "content";
    action: ContentAction;
}

export interface DesignSuggestion extends SuggestionItem {
    type: "design";
    action: DesignAction;
}

export type Suggestion = LayoutSuggestion | ContentSuggestion | DesignSuggestion;

export interface LayoutAction {
    recommendedLayout: string;
    reason: string;
}

export interface ContentAction {
    improvedContent: Record<string, unknown>;
    changes: string[];
}

export interface DesignAction {
    suggestions: Record<string, unknown>;
    rationale: string;
}

export type SuggestionAction = LayoutAction | ContentAction | DesignAction;

export interface SuggestionsResponse {
    slideIndex: number;
    suggestions: Suggestion[];
    generatedAt: string;
}

export const suggestImprovements = async (
    deckId: string,
    slideIndex: number,
    slide: Slide,
): Promise<SuggestionsResponse> => {
    const res = await fetch(`/api/ai/suggest-improvements`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("ss_token") ?? "",
        },
        body: JSON.stringify({ deckId, slideIndex, slide }),
    });
    if (!res.ok) throw new Error(`POST /ai/suggest-improvements failed: ${res.status}`);
    return res.json();
};
