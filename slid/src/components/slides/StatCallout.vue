<script setup lang="ts">
import type { Slide } from "@slid/schema";

const props = defineProps<{ slide: Extract<Slide, { layout: "stat-callout" }> }>();
</script>

<template>
    <section class="ss-canvas font-display flex flex-col justify-center px-128 py-128">
        <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-32">
            {{ props.slide.label }}
        </p>
        <p class="text-[280px] leading-none font-semibold tracking-tight">
            {{ props.slide.stat }}
        </p>
        <p
            v-if="props.slide.supporting"
            class="mt-48 text-subhead text-ink-muted max-w-[1080px]"
        >
            {{ props.slide.supporting }}
        </p>
        <span aria-hidden="true" class="mt-96 block w-128 h-[1px] bg-rule"></span>
    </section>
</template>
