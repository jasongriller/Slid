<script setup lang="ts">
import type { Slide } from "@slidesmith/schema";

const props = defineProps<{ slide: Extract<Slide, { layout: "quote" }> }>();
</script>

<template>
    <section class="ss-canvas grid grid-cols-12">
        <div class="col-span-8 flex flex-col justify-center px-128 py-128">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-32">
                Testimonial
            </p>
            <blockquote class="font-display text-h2 leading-tight tracking-tight max-w-[1100px]">
                <span class="text-ink-soft">“</span>{{ props.slide.quote }}<span class="text-ink-soft">”</span>
            </blockquote>
            <footer class="mt-64 flex items-center gap-24">
                <span aria-hidden="true" class="block w-48 h-[1px] bg-ink"></span>
                <p class="text-body text-ink">
                    {{ props.slide.attribution
                    }}<span v-if="props.slide.role" class="text-ink-soft">
                        — {{ props.slide.role }}</span>
                </p>
            </footer>
        </div>
        <div class="col-span-4 relative bg-surface">
            <img
                v-if="props.slide.image"
                :src="props.slide.image.src"
                :alt="props.slide.image.alt"
                class="absolute inset-0 w-full h-full object-cover grayscale"
            />
        </div>
    </section>
</template>
