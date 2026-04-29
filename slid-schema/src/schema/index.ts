import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Common building blocks                                                     */
/* -------------------------------------------------------------------------- */

export const ImageRefSchema = z.object({
    src: z.string().url(),
    alt: z.string().min(1),
    /** Provenance: where the image came from. Used for attribution + style consistency. */
    source: z.enum(["unsplash", "openai", "user", "url"]),
    /** Optional creator credit (Unsplash etc.). */
    credit: z.string().optional(),
});
export type ImageRef = z.infer<typeof ImageRefSchema>;

export const AccentRoleSchema = z.enum(["none", "subtle", "prominent"]);
export type AccentRole = z.infer<typeof AccentRoleSchema>;

export const BulletSchema = z.string().min(1).max(140);

export const PricingTierSchema = z.object({
    name: z.string().min(1).max(48),
    price: z.string().min(1).max(48),
    cadence: z.string().max(48).optional(),
    features: z.array(BulletSchema).min(1).max(8),
    highlighted: z.boolean().optional(),
});
export type PricingTier = z.infer<typeof PricingTierSchema>;

export const ChartSpecSchema = z.object({
    kind: z.enum(["bar", "line", "donut", "area"]),
    series: z
        .array(
            z.object({
                label: z.string().min(1),
                value: z.number().finite(),
            }),
        )
        .min(2)
        .max(8),
    /** Free-form caption (subtitle of chart). */
    caption: z.string().max(140).optional(),
});
export type ChartSpec = z.infer<typeof ChartSpecSchema>;

const BulletListSchema = z.array(BulletSchema).max(8);

const ColumnSchema = z.object({
    title: z.string().min(1).max(48),
    bullets: z.array(BulletSchema).min(1).max(5),
});

/* -------------------------------------------------------------------------- */
/* Slide variants                                                             */
/* -------------------------------------------------------------------------- */

export const CoverSlideSchema = z.object({
    layout: z.literal("cover"),
    eyebrow: z.string().max(48).optional(),
    title: z.string().min(1).max(120),
    subtitle: z.string().max(180).optional(),
    image: ImageRefSchema.optional(),
    accent: AccentRoleSchema.optional(),
});

export const AgendaSlideSchema = z.object({
    layout: z.literal("agenda"),
    eyebrow: z.string().max(48).optional(),
    title: z.string().max(120).optional(),
    items: z.array(z.string().min(1).max(80)).min(2).max(7),
    accent: AccentRoleSchema.optional(),
});

export const SplitHeroSlideSchema = z.object({
    layout: z.literal("split-hero"),
    eyebrow: z.string().max(48).optional(),
    headline: z.string().min(1).max(120),
    subhead: z.string().max(220).optional(),
    bullets: BulletListSchema.optional(),
    image: ImageRefSchema,
    accent: AccentRoleSchema.optional(),
});

export const StatCalloutSlideSchema = z.object({
    layout: z.literal("stat-callout"),
    stat: z.string().min(1).max(24),
    label: z.string().min(1).max(80),
    supporting: z.string().max(220).optional(),
    accent: AccentRoleSchema.optional(),
});

export const QuoteSlideSchema = z.object({
    layout: z.literal("quote"),
    quote: z.string().min(1).max(320),
    attribution: z.string().min(1).max(80),
    role: z.string().max(80).optional(),
    image: ImageRefSchema.optional(),
    accent: AccentRoleSchema.optional(),
});

export const TimelineSlideSchema = z.object({
    layout: z.literal("timeline"),
    title: z.string().max(80).optional(),
    phases: z
        .array(
            z.object({
                title: z.string().min(1).max(48),
                description: z.string().max(160).optional(),
                date: z.string().max(32).optional(),
            }),
        )
        .min(2)
        .max(6),
});

export const ProcessSlideSchema = z.object({
    layout: z.literal("process"),
    title: z.string().max(80).optional(),
    steps: z
        .array(
            z.object({
                title: z.string().min(1).max(48),
                description: z.string().max(160).optional(),
            }),
        )
        .min(2)
        .max(6),
});

export const ComparisonSlideSchema = z.object({
    layout: z.literal("comparison"),
    title: z.string().max(80).optional(),
    left: ColumnSchema,
    right: ColumnSchema,
});

export const ImageLedSlideSchema = z.object({
    layout: z.literal("image-led"),
    image: ImageRefSchema,
    caption: z.string().max(220).optional(),
});

export const DataVizSlideSchema = z.object({
    layout: z.literal("data-viz"),
    title: z.string().max(80).optional(),
    chart: ChartSpecSchema,
    takeaway: z.string().min(1).max(220),
});

export const TeamSlideSchema = z.object({
    layout: z.literal("team"),
    title: z.string().max(80).optional(),
    members: z
        .array(
            z.object({
                name: z.string().min(1).max(48),
                role: z.string().min(1).max(48),
                photo: ImageRefSchema.optional(),
            }),
        )
        .min(2)
        .max(8),
});

export const PricingSlideSchema = z.object({
    layout: z.literal("pricing"),
    title: z.string().max(80).optional(),
    tiers: z.array(PricingTierSchema).min(1).max(3),
});

export const NextStepsSlideSchema = z.object({
    layout: z.literal("next-steps"),
    title: z.string().max(80).optional(),
    actions: z
        .array(
            z.object({
                title: z.string().min(1).max(120),
                owner: z.string().max(48).optional(),
                due: z.string().max(48).optional(),
            }),
        )
        .min(1)
        .max(5),
});

export const SectionDividerSlideSchema = z.object({
    layout: z.literal("section-divider"),
    eyebrow: z.string().max(48).optional(),
    title: z.string().min(1).max(120),
    accent: AccentRoleSchema.optional(),
});

export const TwoColumnTextSlideSchema = z.object({
    layout: z.literal("two-column-text"),
    title: z.string().max(80).optional(),
    left: z.string().min(1).max(600),
    right: z.string().min(1).max(600),
});

export const BulletListSlideSchema = z.object({
    layout: z.literal("bullet-list"),
    headline: z.string().min(1).max(120),
    bullets: z.array(BulletSchema).min(1).max(5),
});

export const LogoWallSlideSchema = z.object({
    layout: z.literal("logo-wall"),
    title: z.string().max(80).optional(),
    logos: z.array(ImageRefSchema).min(3).max(12),
});

export const CalloutCardSlideSchema = z.object({
    layout: z.literal("callout-card"),
    eyebrow: z.string().max(48).optional(),
    statement: z.string().min(1).max(220),
    accent: AccentRoleSchema.optional(),
});

export const BeforeAfterSlideSchema = z.object({
    layout: z.literal("before-after"),
    title: z.string().max(80).optional(),
    before: z.object({
        label: z.string().min(1).max(48),
        description: z.string().max(220),
        image: ImageRefSchema.optional(),
    }),
    after: z.object({
        label: z.string().min(1).max(48),
        description: z.string().max(220),
        image: ImageRefSchema.optional(),
    }),
});

export const MetricsSlideSchema = z.object({
    layout: z.literal("metrics"),
    title: z.string().max(80).optional(),
    metrics: z
        .array(
            z.object({
                value: z.string().min(1).max(16),
                label: z.string().min(1).max(48),
            }),
        )
        .min(2)
        .max(4),
});

export const ClosingThanksSlideSchema = z.object({
    layout: z.literal("closing-thanks"),
    message: z.string().min(1).max(120),
    contact: z.string().max(120).optional(),
});

/* -------------------------------------------------------------------------- */
/* Discriminated union                                                        */
/* -------------------------------------------------------------------------- */

export const SlideSchema = z.discriminatedUnion("layout", [
    CoverSlideSchema,
    AgendaSlideSchema,
    SplitHeroSlideSchema,
    StatCalloutSlideSchema,
    QuoteSlideSchema,
    TimelineSlideSchema,
    ProcessSlideSchema,
    ComparisonSlideSchema,
    ImageLedSlideSchema,
    DataVizSlideSchema,
    TeamSlideSchema,
    PricingSlideSchema,
    NextStepsSlideSchema,
    SectionDividerSlideSchema,
    TwoColumnTextSlideSchema,
    BulletListSlideSchema,
    LogoWallSlideSchema,
    CalloutCardSlideSchema,
    BeforeAfterSlideSchema,
    MetricsSlideSchema,
    ClosingThanksSlideSchema,
]);
export type Slide = z.infer<typeof SlideSchema>;

/* -------------------------------------------------------------------------- */
/* Brand + theme + deck                                                        */
/* -------------------------------------------------------------------------- */

export const BrandSchema = z.object({
    name: z.string().min(1).max(80),
    logo: ImageRefSchema.optional(),
    /** A single accent color (hex) overlaid on top of the theme. */
    accentColor: z
        .string()
        .regex(/^#([0-9a-fA-F]{6})$/, "accentColor must be a 6-digit hex")
        .optional(),
    fontPair: z
        .object({
            display: z.string().min(1),
            body: z.string().min(1),
        })
        .optional(),
});
export type Brand = z.infer<typeof BrandSchema>;

export const ThemeIdSchema = z.enum([
    "minimal-mono",
    "editorial",
    "bold-modern",
    "corporate-refined",
    "tech-gradient",
    "swiss-grid",
]);
export type ThemeIdValue = z.infer<typeof ThemeIdSchema>;

export const DeckSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1).max(120),
    audience: z.string().max(120).optional(),
    tone: z.string().max(80).optional(),
    theme: ThemeIdSchema,
    brand: BrandSchema.optional(),
    /** A short stylistic descriptor used to keep deck-wide imagery cohesive. */
    imageStyle: z.string().max(160).optional(),
    slides: z.array(SlideSchema).min(1).max(40),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
export type Deck = z.infer<typeof DeckSchema>;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export interface ValidationOk {
    ok: true;
    deck: Deck;
}

export interface ValidationErr {
    ok: false;
    errors: string[];
}

/**
 * Validate raw deck JSON (e.g. from the AI). Returns a flat error list on failure
 * for inclusion in retry prompts.
 */
export const validateDeck = (input: unknown): ValidationOk | ValidationErr => {
    const result = DeckSchema.safeParse(input);
    if (result.success) {
        return { ok: true, deck: result.data };
    }
    return {
        ok: false,
        errors: result.error.issues.map(
            (i) => `${i.path.join(".") || "<root>"}: ${i.message}`,
        ),
    };
};
