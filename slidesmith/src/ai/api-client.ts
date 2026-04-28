import { DeckSchema, SlideSchema, type Deck, type Slide } from "@slidesmith/schema";

export interface GenerateBrief {
    topic: string;
    audience: string;
    tone: string;
    outline?: string;
    slideCount?: number;
    brand?: {
        name: string;
        accentColor?: string;
    };
}

const post = async (path: string, body: unknown): Promise<unknown> => {
    const res = await fetch(`/api${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("ss_token") ?? "",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
};

export const generateDeck = async (brief: GenerateBrief): Promise<Deck> => {
    const json = await post("/ai/generate-deck", brief);
    const parsed = DeckSchema.parse(json);
    return parsed;
};

export const regenerateSlide = async (
    deckId: string,
    slideIndex: number,
    hint?: string,
): Promise<Slide | null> => {
    try {
        const json = await post("/ai/regenerate-slide", { deckId, slideIndex, hint });
        return SlideSchema.parse(json);
    } catch {
        return null;
    }
};
