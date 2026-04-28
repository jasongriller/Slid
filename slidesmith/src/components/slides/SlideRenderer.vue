<script setup lang="ts">
import type { Slide } from "@slidesmith/schema";
import Cover from "./Cover.vue";
import SplitHero from "./SplitHero.vue";
import StatCallout from "./StatCallout.vue";
import Quote from "./Quote.vue";
import Agenda from "./Agenda.vue";

defineProps<{ slide: Slide }>();
</script>

<template>
    <Cover v-if="slide.layout === 'cover'" :slide="slide" />
    <SplitHero v-else-if="slide.layout === 'split-hero'" :slide="slide" />
    <StatCallout v-else-if="slide.layout === 'stat-callout'" :slide="slide" />
    <Quote v-else-if="slide.layout === 'quote'" :slide="slide" />
    <Agenda v-else-if="slide.layout === 'agenda'" :slide="slide" />
    <section
        v-else
        class="ss-canvas flex flex-col justify-center items-center text-center px-128 py-128"
    >
        <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-32">
            Layout not yet implemented
        </p>
        <h2 class="font-display text-h2 font-semibold tracking-tight">
            {{ slide.layout }}
        </h2>
        <p class="mt-32 text-body text-ink-muted max-w-[900px]">
            This deck used a layout variant whose Minimal Mono component has not yet shipped.
            Add it to <code>src/components/slides</code> and register it in
            <code>SlideRenderer.vue</code>.
        </p>
    </section>
</template>
