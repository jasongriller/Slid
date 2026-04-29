/**
 * Layout registry. Every legal slide layout lives here.
 * The AI is constrained to choose `id` values from this list and the
 * Vue renderer is required to provide a component for each id.
 */

export type ContentType =
    | "title"
    | "agenda"
    | "narrative"
    | "stat"
    | "quote"
    | "list"
    | "comparison"
    | "process"
    | "timeline"
    | "image"
    | "data"
    | "team"
    | "pricing"
    | "cta";

export interface LayoutMeta {
    id: string;
    label: string;
    description: string;
    /** Content types this layout is appropriate for. Drives layout selection. */
    suitableFor: ContentType[];
    /** Capabilities the renderer must support. */
    supportsImage: boolean;
    supportsAccent: boolean;
    /** Hard caps on content shape; AI prompt enforces these. */
    maxBullets?: number;
    maxItems?: number;
}

export const layoutRegistry: Record<string, LayoutMeta> = {
    cover: {
        id: "cover",
        label: "Cover",
        description: "Title slide with optional eyebrow, subtitle, and image.",
        suitableFor: ["title"],
        supportsImage: true,
        supportsAccent: true,
    },
    agenda: {
        id: "agenda",
        label: "Agenda",
        description: "Numbered list of upcoming sections.",
        suitableFor: ["agenda", "list"],
        supportsImage: false,
        supportsAccent: true,
        maxItems: 7,
    },
    "split-hero": {
        id: "split-hero",
        label: "Split hero",
        description: "Left text, right image. Strong narrative slide.",
        suitableFor: ["narrative"],
        supportsImage: true,
        supportsAccent: true,
        maxBullets: 4,
    },
    "stat-callout": {
        id: "stat-callout",
        label: "Stat callout",
        description: "One enormous numeric stat with a label and supporting line.",
        suitableFor: ["stat"],
        supportsImage: false,
        supportsAccent: true,
    },
    quote: {
        id: "quote",
        label: "Quote",
        description: "A pulled quote with attribution and optional portrait.",
        suitableFor: ["quote"],
        supportsImage: true,
        supportsAccent: true,
    },
    timeline: {
        id: "timeline",
        label: "Timeline",
        description: "Horizontal sequence of phases with dates.",
        suitableFor: ["timeline", "process"],
        supportsImage: false,
        supportsAccent: true,
        maxItems: 6,
    },
    process: {
        id: "process",
        label: "Process",
        description: "Numbered process steps with brief descriptions.",
        suitableFor: ["process"],
        supportsImage: false,
        supportsAccent: true,
        maxItems: 6,
    },
    comparison: {
        id: "comparison",
        label: "Comparison",
        description: "Two-column comparison with header and bullets per side.",
        suitableFor: ["comparison"],
        supportsImage: false,
        supportsAccent: true,
        maxBullets: 5,
    },
    "image-led": {
        id: "image-led",
        label: "Image-led",
        description: "Full-bleed image with a caption.",
        suitableFor: ["image", "narrative"],
        supportsImage: true,
        supportsAccent: false,
    },
    "data-viz": {
        id: "data-viz",
        label: "Data visualization",
        description: "Chart with a single takeaway sentence.",
        suitableFor: ["data", "stat"],
        supportsImage: false,
        supportsAccent: true,
    },
    team: {
        id: "team",
        label: "Team",
        description: "Grid of team members with name and role.",
        suitableFor: ["team"],
        supportsImage: true,
        supportsAccent: true,
        maxItems: 8,
    },
    pricing: {
        id: "pricing",
        label: "Pricing",
        description: "Up to three pricing tiers with feature bullets.",
        suitableFor: ["pricing"],
        supportsImage: false,
        supportsAccent: true,
        maxItems: 3,
    },
    "next-steps": {
        id: "next-steps",
        label: "Next steps",
        description: "Action items with owners and due dates.",
        suitableFor: ["cta"],
        supportsImage: false,
        supportsAccent: true,
        maxItems: 5,
    },
    "section-divider": {
        id: "section-divider",
        label: "Section divider",
        description: "Eyebrow + huge section title for chapter breaks.",
        suitableFor: ["title"],
        supportsImage: false,
        supportsAccent: true,
    },
    "two-column-text": {
        id: "two-column-text",
        label: "Two-column text",
        description: "Two body columns of supporting prose.",
        suitableFor: ["narrative"],
        supportsImage: false,
        supportsAccent: false,
    },
    "bullet-list": {
        id: "bullet-list",
        label: "Bullet list",
        description: "Headline plus a tight bullet list. Use sparingly.",
        suitableFor: ["list"],
        supportsImage: false,
        supportsAccent: true,
        maxBullets: 5,
    },
    "logo-wall": {
        id: "logo-wall",
        label: "Logo wall",
        description: "Grid of customer/partner logos.",
        suitableFor: ["narrative"],
        supportsImage: true,
        supportsAccent: false,
        maxItems: 12,
    },
    "callout-card": {
        id: "callout-card",
        label: "Callout card",
        description: "A single emphasized statement card on a quiet field.",
        suitableFor: ["narrative", "cta"],
        supportsImage: false,
        supportsAccent: true,
    },
    "before-after": {
        id: "before-after",
        label: "Before / After",
        description: "Two-state comparison framed as transformation.",
        suitableFor: ["comparison", "narrative"],
        supportsImage: true,
        supportsAccent: true,
    },
    metrics: {
        id: "metrics",
        label: "Metrics",
        description: "Three-up stat row with labels.",
        suitableFor: ["stat", "data"],
        supportsImage: false,
        supportsAccent: true,
        maxItems: 4,
    },
    "closing-thanks": {
        id: "closing-thanks",
        label: "Closing / Thanks",
        description: "Final slide. Contact details and a single message.",
        suitableFor: ["cta"],
        supportsImage: false,
        supportsAccent: true,
    },
};

export const layoutIds = Object.keys(layoutRegistry);

export const isLayoutId = (id: string): boolean =>
    Object.prototype.hasOwnProperty.call(layoutRegistry, id);

export interface LayoutSelectionInput {
    contentType: ContentType;
    hasImage?: boolean;
    bulletCount?: number;
    itemCount?: number;
}

export interface LayoutSelectionResult {
    id: string;
    reason: string;
}

/**
 * Pick the best layout for a given content shape.
 * Pure function so it can be unit-tested to 100% coverage and reused
 * by the AI prompt builder when generating examples.
 */
export const pickLayout = (input: LayoutSelectionInput): LayoutSelectionResult => {
    const candidates = layoutIds
        .map((id) => layoutRegistry[id]!)
        .filter((meta) => meta.suitableFor.includes(input.contentType));

    if (candidates.length === 0) {
        return {
            id: "callout-card",
            reason: "no exact match; falling back to a quiet callout card",
        };
    }

    // Prefer image-supporting layout when an image is provided.
    if (input.hasImage) {
        const withImage = candidates.find((c) => c.supportsImage);
        if (withImage) {
            return { id: withImage.id, reason: "content has an image; chose image-supporting layout" };
        }
    }

    // Respect bullet caps.
    if (typeof input.bulletCount === "number") {
        const okBullets = candidates.find(
            (c) => typeof c.maxBullets !== "number" || input.bulletCount! <= c.maxBullets,
        );
        if (okBullets) {
            return { id: okBullets.id, reason: "respects bullet count cap" };
        }
    }

    // Respect item caps.
    if (typeof input.itemCount === "number") {
        const okItems = candidates.find(
            (c) => typeof c.maxItems !== "number" || input.itemCount! <= c.maxItems,
        );
        if (okItems) {
            return { id: okItems.id, reason: "respects item count cap" };
        }
    }

    return { id: candidates[0]!.id, reason: "first registry match for content type" };
};
