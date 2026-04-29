import {
    DeckSchema,
    SlideSchema,
    validateDeck,
    type Deck,
    type Slide,
} from "../src/schema/index.js";

const sampleImage = {
    src: "https://images.example.com/sample.jpg",
    alt: "A sample image",
    source: "unsplash" as const,
};

const sampleSlides: Slide[] = [
    { layout: "cover", title: "Pitch", subtitle: "A great proposal", image: sampleImage },
    { layout: "agenda", items: ["Intro", "Problem", "Solution"] },
    {
        layout: "split-hero",
        headline: "We help teams ship",
        subhead: "Faster, calmer.",
        bullets: ["Less meetings", "Shorter PRs"],
        image: sampleImage,
    },
    { layout: "stat-callout", stat: "98%", label: "Customer NPS" },
    { layout: "quote", quote: "It just works.", attribution: "A customer" },
    {
        layout: "timeline",
        phases: [
            { title: "Discovery", date: "Q1" },
            { title: "Build", date: "Q2" },
        ],
    },
    {
        layout: "process",
        steps: [
            { title: "Audit" },
            { title: "Design" },
            { title: "Ship" },
        ],
    },
    {
        layout: "comparison",
        left: { title: "Today", bullets: ["Slow"] },
        right: { title: "With us", bullets: ["Fast"] },
    },
    { layout: "image-led", image: sampleImage, caption: "On-brand" },
    {
        layout: "data-viz",
        chart: {
            kind: "bar",
            series: [
                { label: "A", value: 10 },
                { label: "B", value: 20 },
            ],
        },
        takeaway: "B beats A",
    },
    {
        layout: "team",
        members: [
            { name: "Ada", role: "CEO" },
            { name: "Linus", role: "CTO" },
        ],
    },
    {
        layout: "pricing",
        tiers: [{ name: "Pro", price: "$99", features: ["All the things"] }],
    },
    {
        layout: "next-steps",
        actions: [{ title: "Sign the SOW", owner: "Client", due: "Friday" }],
    },
    { layout: "section-divider", title: "Approach" },
    {
        layout: "two-column-text",
        left: "Left column body.",
        right: "Right column body.",
    },
    { layout: "bullet-list", headline: "Why us", bullets: ["Track record"] },
    { layout: "logo-wall", logos: [sampleImage, sampleImage, sampleImage] },
    { layout: "callout-card", statement: "One sentence that lands." },
    {
        layout: "before-after",
        before: { label: "Before", description: "Slow." },
        after: { label: "After", description: "Fast." },
    },
    {
        layout: "metrics",
        metrics: [
            { value: "10x", label: "Faster" },
            { value: "0", label: "Outages" },
        ],
    },
    { layout: "closing-thanks", message: "Thank you." },
];

const buildDeck = (slides: Slide[] = sampleSlides): Deck => ({
    id: "deck-1",
    title: "Sample deck",
    audience: "Executives",
    tone: "Confident",
    theme: "minimal-mono",
    slides,
});

describe("SlideSchema", () => {
    test.each(sampleSlides.map((s) => [s.layout, s] as const))(
        "validates %s",
        (_layout, slide) => {
            const result = SlideSchema.safeParse(slide);
            expect(result.success).toBe(true);
        },
    );

    test("rejects an unknown layout", () => {
        const result = SlideSchema.safeParse({ layout: "fake", title: "x" });
        expect(result.success).toBe(false);
    });

    test("rejects an over-long stat", () => {
        const result = SlideSchema.safeParse({
            layout: "stat-callout",
            stat: "x".repeat(64),
            label: "Too long",
        });
        expect(result.success).toBe(false);
    });
});

describe("DeckSchema", () => {
    test("validates a complete deck with every layout", () => {
        const result = DeckSchema.safeParse(buildDeck());
        expect(result.success).toBe(true);
    });

    test("rejects a deck with zero slides", () => {
        const result = DeckSchema.safeParse(buildDeck([]));
        expect(result.success).toBe(false);
    });

    test("rejects an unknown theme id", () => {
        const result = DeckSchema.safeParse({ ...buildDeck(), theme: "fake-theme" });
        expect(result.success).toBe(false);
    });

    test("accepts an optional brand with a hex accent color", () => {
        const result = DeckSchema.safeParse({
            ...buildDeck(),
            brand: { name: "Acme", accentColor: "#FF5500" },
        });
        expect(result.success).toBe(true);
    });

    test("rejects a brand with a malformed accent color", () => {
        const result = DeckSchema.safeParse({
            ...buildDeck(),
            brand: { name: "Acme", accentColor: "red" },
        });
        expect(result.success).toBe(false);
    });
});

describe("validateDeck", () => {
    test("returns ok=true on a valid deck", () => {
        const result = validateDeck(buildDeck());
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.deck.title).toBe("Sample deck");
        }
    });

    test("returns ok=false with a flat error list on invalid input", () => {
        const result = validateDeck({ ...buildDeck(), slides: [] });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toMatch(/slides/);
        }
    });

    test("returns ok=false on a totally malformed input", () => {
        const result = validateDeck({});
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.errors.some((e) => e.startsWith("id"))).toBe(true);
        }
    });

    test("returns root-tagged errors when the input is not an object", () => {
        const result = validateDeck("not-a-deck");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.errors[0]).toMatch(/<root>/);
        }
    });
});
