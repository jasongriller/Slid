<script setup lang="ts">
import type { Slide } from "@slid/schema";

const props = defineProps<{ slide: Extract<Slide, { layout: "split-hero" }> }>();
</script>

<template>
    <section class="ss-canvas grid grid-cols-12">
        <div class="col-span-7 flex flex-col justify-center px-128 py-96">
            <p
                v-if="props.slide.eyebrow"
                class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-32"
            >
                {{ props.slide.eyebrow }}
            </p>
            <h2 class="font-display text-h2 font-semibold tracking-tight max-w-[900px]">
                {{ props.slide.headline }}
            </h2>
            <p
                v-if="props.slide.subhead"
                class="mt-32 text-subhead text-ink-muted max-w-[820px]"
            >
                {{ props.slide.subhead }}
            </p>
            <ul
                v-if="props.slide.bullets && props.slide.bullets.length"
                class="mt-48 space-y-16 max-w-[760px]"
            >
                <li
                    v-for="(bullet, i) in props.slide.bullets"
                    :key="i"
                    class="flex gap-24 text-body text-ink"
                >
                    <span aria-hidden="true" class="mt-12 block w-24 h-[1px] bg-ink"></span>
                    <span>{{ bullet }}</span>
                </li>
            </ul>
        </div>
        <div class="col-span-5 relative bg-surface">
            <img
                :src="props.slide.image.src"
                :alt="props.slide.image.alt"
                class="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    </section>
</template>
