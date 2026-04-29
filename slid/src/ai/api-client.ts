import { DeckSchema, SlideSchema, type Deck, type Slide } from "@slid/schema";

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

// Track if backend is available
let backendAvailable: boolean | null = null;

const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const res = await fetch('/api/health', { 
            method: 'GET',
            signal: controller.signal 
        });
        clearTimeout(timeoutId);
        return res.ok;
    } catch {
        return false;
    }
};

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

/**
 * Generate a mock deck based on the brief when backend is unavailable
 */
const generateMockDeck = (brief: GenerateBrief): Deck => {
    const id = `deck-${Date.now()}`;
    const slideCount = brief.slideCount || 6;
    
    // Create slides based on the topic
    const slides: Slide[] = [];
    
    // Cover slide
    slides.push({
        layout: "cover",
        eyebrow: `${brief.audience} · ${new Date().getFullYear()}`,
        title: brief.topic,
        subtitle: `A ${brief.tone.toLowerCase()} presentation crafted for ${brief.audience.toLowerCase()}.`,
        image: {
            src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
            alt: "Professional workspace with natural lighting",
            source: "unsplash",
        },
    });
    
    // Agenda slide
    slides.push({
        layout: "agenda",
        eyebrow: "Overview",
        title: "What we'll cover today",
        items: [
            "Understanding the current landscape",
            "Key challenges and opportunities",
            "Our proposed approach",
            "Expected outcomes and metrics",
            "Next steps and timeline",
        ].slice(0, Math.min(5, slideCount - 2)),
    });
    
    // Content slides based on count
    const contentSlides: Slide[] = [
        {
            layout: "split-hero",
            eyebrow: "The Challenge",
            headline: "Every great solution starts with understanding the problem.",
            subhead: `For ${brief.audience.toLowerCase()}, the stakes have never been higher.`,
            bullets: [
                "Market dynamics are shifting rapidly",
                "Traditional approaches are showing limitations",
                "New opportunities require new thinking",
            ],
            image: {
                src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200",
                alt: "Modern technology workspace",
                source: "unsplash",
            },
        },
        {
            layout: "stat-callout",
            stat: "73%",
            label: "Of leaders see this as a priority",
            supporting: `Research shows that ${brief.audience.toLowerCase()} are increasingly focused on this area, with significant investment planned for the coming year.`,
        },
        {
            layout: "split-hero",
            eyebrow: "Our Approach",
            headline: "A thoughtful solution designed for real impact.",
            subhead: "We've developed an approach that balances innovation with practicality.",
            bullets: [
                "Built on proven methodologies",
                "Customized for your specific context",
                "Designed for sustainable results",
            ],
            image: {
                src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
                alt: "Strategic planning session",
                source: "unsplash",
            },
        },
        {
            layout: "quote",
            quote: "The best solutions are the ones that feel inevitable in hindsight.",
            attribution: "Industry Leader",
            role: `${brief.audience.split(' ')[0]} Executive`,
            image: {
                src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200",
                alt: "Professional portrait",
                source: "unsplash",
            },
        },
        {
            layout: "stat-callout",
            stat: "3x",
            label: "Faster time to value",
            supporting: "Organizations using this approach report significantly faster implementation and earlier realization of benefits.",
        },
        {
            layout: "agenda",
            eyebrow: "Next Steps",
            title: "Moving forward together",
            items: [
                "Schedule deep-dive session",
                "Review detailed proposal",
                "Align stakeholders",
                "Begin pilot program",
                "Measure and iterate",
            ],
        },
    ];
    
    // Add content slides based on requested count
    const neededSlides = Math.max(0, slideCount - 2); // -2 for cover and agenda
    for (let i = 0; i < neededSlides && i < contentSlides.length; i++) {
        slides.push(contentSlides[i]);
    }
    
    return {
        id,
        title: brief.topic,
        audience: brief.audience,
        tone: brief.tone,
        theme: "minimal-mono",
        slides,
    };
};

export const generateDeck = async (brief: GenerateBrief): Promise<Deck> => {
    // Check backend availability if not yet determined
    if (backendAvailable === null) {
        backendAvailable = await checkBackendHealth();
    }
    
    // If backend is not available, use mock generation
    if (!backendAvailable) {
        console.info('[Slid] Backend unavailable, using mock deck generation');
        // Simulate a brief delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockDeck = generateMockDeck(brief);
        return DeckSchema.parse(mockDeck);
    }
    
    // Try the real API
    try {
        const json = await post("/ai/generate-deck", brief);
        const parsed = DeckSchema.parse(json);
        return parsed;
    } catch (error) {
        // If API fails, mark backend as unavailable and use mock
        console.warn('[Slid] API call failed, falling back to mock generation:', error);
        backendAvailable = false;
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockDeck = generateMockDeck(brief);
        return DeckSchema.parse(mockDeck);
    }
};

export const regenerateSlide = async (
    deckId: string,
    slideIndex: number,
    hint?: string,
): Promise<Slide | null> => {
    // If backend is known to be unavailable, return null
    if (backendAvailable === false) {
        console.info('[Slid] Backend unavailable, slide regeneration not available in mock mode');
        return null;
    }
    
    try {
        const json = await post("/ai/regenerate-slide", { deckId, slideIndex, hint });
        return SlideSchema.parse(json);
    } catch (error) {
        console.error('Failed to regenerate slide:', error);
        return null;
    }
};

/**
 * Reset backend availability check (useful for retry logic)
 */
export const resetBackendCheck = () => {
    backendAvailable = null;
};

/**
 * Check if running in mock mode
 */
export const isMockMode = () => backendAvailable === false;
