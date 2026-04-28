<script setup lang="ts">
import type { Slide } from "@slidesmith/schema";

const props = defineProps<{ slide: Extract<Slide, { layout: "cover" }> }>();
</script>

<template>
    <section class="ss-canvas font-display flex flex-col justify-between p-128">
        <header class="flex items-center justify-between">
            <p v-if="props.slide.eyebrow" class="font-body text-eyebrow uppercase text-ink-soft">
                {{ props.slide.eyebrow }}
            </p>
            <span aria-hidden="true" class="block w-48 h-[2px] bg-ink"></span>
        </header>

        <div class="grid grid-cols-slide gap-64 items-end">
            <div class="col-span-9">
                <h1 class="text-headline font-semibold tracking-tight">
                    {{ props.slide.title }}
                </h1>
                <p
                    v-if="props.slide.subtitle"
                    class="mt-32 text-subhead text-ink-muted max-w-[1100px]"
                >
                    {{ props.slide.subtitle }}
                </p>
            </div>
            <div class="col-span-3 flex justify-end">
                <img
                    v-if="props.slide.image"
                    :src="props.slide.image.src"
                    :alt="props.slide.image.alt"
                    class="w-full aspect-square object-cover"
                />
            </div>
        </div>

        <footer class="flex items-end justify-between">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">
                Slidesmith
            </p>
            <span aria-hidden="true" class="block w-128 h-[1px] bg-rule"></span>
        </footer>
    </section>
</template>
