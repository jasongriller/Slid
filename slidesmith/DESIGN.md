# Slidesmith Design Philosophy
Slidesmith exists because most AI slide tools produce slop. They use 3–4 layouts
on repeat, generate text first and stuff it into a layout afterwards, and have
no real design system. This doc is the contract that prevents Slidesmith from
becoming yet another one of those tools.
## First principles
1. **AI never emits styling.** It picks from a typed schema and fills content.
   Visual decisions belong to designers and tokens, not LLMs.
2. **Tokens are the only legal styling primitives.** Typography sizes, spacings,
   colors, radii, and shadows all come from `@slidesmith/schema`'s tokens.
   Arbitrary values in templates are forbidden in code review.
3. **Layouts have personalities.** Each layout exists for a specific *content
   type*. Stat callouts are not bullet lists. Quotes are not block paragraphs.
   The layout registry encodes which layouts are appropriate for which content.
4. **Composition over decoration.** No drop shadows in Minimal Mono. No
   gradients. No sticker icons. The good stuff is asymmetry, ratio, and
   whitespace.
5. **The bar is Stripe / Linear / Apple Keynote.** If a slide could plausibly
   ship in a Stripe pitch deck, it passes. If it looks like a default Canva
   template, it fails.
## How content flows
```
brief
  → AI prompt (forbids ugly defaults, requires structured output)
  → GPT-4o structured output
  → Zod validation (retry once on failure, then 422)
  → Imagery pass (Unsplash + OpenAI Images, deck-level style descriptor)
  → Persisted Deck JSON
  → Vue renderer maps layout id → component
  → 1920×1080 canvas
```
The renderer is the only place pixels are decided. The AI never knows about
pixels.
## Tokens (`@slidesmith/schema`)
- **Typography**: hard cap of 6 sizes. Adding a 7th requires a design review
  and a corresponding test update.
- **Spacing**: 8pt grid, 10 stops. Off-grid values are rejected at build time
  by lint (TODO) and at review time by humans.
- **Color**: roles, not concrete colors. `bg`, `surface`, `ink`, `ink-muted`,
  `ink-soft`, `rule`, `accent`. Themes map roles → hex.
- **Grid**: 12-col at 1920×1080 with 64px gutters, 160px outside margins.
## Adding a layout (without regressing quality)
1. Add a Zod variant in `slidesmith-schema/src/schema/index.ts` with strict
   max-lengths and item caps.
2. Register the layout in `slidesmith-schema/src/layouts/index.ts` with
   `suitableFor`, `supportsImage`, `supportsAccent`, and any caps.
3. Build the Vue component in `slidesmith/src/components/slides/<Name>.vue`.
   Use **only** token-driven Tailwind classes (`text-headline`, `bg-bg`,
   `p-128`, etc.). No arbitrary values except for one-off geometric primitives
   (e.g. a dividing rule with `h-[1px]`).
4. Wire the component into `SlideRenderer.vue`.
5. Add the layout to `sampleDeck.ts` and to the README's Layout checklist.
6. Add at least one test case in `slidesmith-schema/test/schema.test.ts` and
   confirm `npm test --coverage` is still 100% on the schema package.
## Adding a theme (without regressing quality)
1. Add the theme to `tokens.themes` with all 7 color roles, radii, shadows, and
   flourish flags.
2. Add it to `ThemeIdSchema` in `schema/index.ts`.
3. Decide whether the theme allows shadows, gradients, or geometric flourishes.
   If it does, make sure those are *expressively scoped* — never a generic
   "all surfaces have a soft shadow."
4. Update layout components conditionally only where the theme genuinely
   diverges. Most components should be theme-agnostic by virtue of consuming
   roles via CSS variables.
5. Pair display + body Google Fonts that share an x-height. Avoid loading
   more than two families per theme.
6. Build a one-deck visual reference in `sampleDeck.ts` to lock the bar.
## Forbidden defaults
- Centering body text by default.
- Using a bullet list for a single statistic.
- Using a stock-feeling drop shadow on cards.
- Using more than two type sizes in a single slide.
- Mixing two accent colors in one deck.
- Filling whitespace because it "looks empty." It's not empty; it's intentional.
## Quality gate
A change ships only if:
- All `@slidesmith/schema` tests pass with 100% coverage.
- The change doesn't introduce arbitrary CSS values.
- A visual review of the sample deck still feels like a Stripe pitch deck.
