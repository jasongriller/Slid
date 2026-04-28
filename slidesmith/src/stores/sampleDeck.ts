import type { Deck } from "@slidesmith/schema";

/**
 * Reference deck used when no backend is available.
 * Showcases all 5 implemented Minimal Mono layouts at the design quality bar.
 */
export const sampleDeck: Deck = {
    id: "sample-deck",
    title: "Quiet Confidence",
    audience: "Series B SaaS executives",
    tone: "Restrained, confident, intentional",
    theme: "minimal-mono",
    slides: [
        {
            layout: "cover",
            eyebrow: "Proposal · 2026",
            title: "A calmer way to ship.",
            subtitle:
                "We help engineering organizations replace meetings, status decks, and dashboards with a single intentional surface.",
            image: {
                src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
                alt: "A quiet workspace with morning light.",
                source: "unsplash",
            },
        },
        {
            layout: "agenda",
            eyebrow: "Today",
            title: "What we will cover.",
            items: [
                "The cost of dashboard sprawl",
                "Our approach to a quieter surface",
                "What changes in week one",
                "Investment and timeline",
                "Open questions",
            ],
        },
        {
            layout: "split-hero",
            eyebrow: "The problem",
            headline: "Teams ship faster when fewer things demand their attention.",
            subhead:
                "Most teams don't have a dashboard problem. They have an attention budget problem.",
            bullets: [
                "27 internal dashboards on average",
                "44% are looked at less than once a quarter",
                "Engineers report 2.1 hours/day in coordination overhead",
            ],
            image: {
                src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200",
                alt: "An empty desk in soft afternoon light.",
                source: "unsplash",
            },
        },
        {
            layout: "stat-callout",
            stat: "2.1 hrs",
            label: "Lost per engineer per day",
            supporting:
                "Coordination overhead, status meetings, and chasing dashboards. We measured this across 14 customer teams in 2025.",
        },
        {
            layout: "quote",
            quote:
                "We removed seven recurring meetings in the first month. The team felt the difference before they saw the metrics.",
            attribution: "Maya Lin",
            role: "VP Engineering, Northwind",
            image: {
                src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200",
                alt: "A portrait at three-quarters angle.",
                source: "unsplash",
            },
        },
    ],
};
