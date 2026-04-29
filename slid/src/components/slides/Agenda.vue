<script setup lang="ts">
import type { Slide } from "@slid/schema";

const props = defineProps<{ slide: Extract<Slide, { layout: "agenda" }> }>();
</script>

<template>
    <section class="ss-canvas grid grid-cols-12 px-128 py-128 gap-64">
        <div class="col-span-4 flex flex-col justify-between">
            <div>
                <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-32">
                    {{ props.slide.eyebrow ?? "Agenda" }}
                </p>
                <h2 class="font-display text-h2 font-semibold tracking-tight">
                    {{ props.slide.title ?? "What we will cover" }}
                </h2>
            </div>
            <span aria-hidden="true" class="block w-128 h-[1px] bg-rule"></span>
        </div>
        <ol class="col-span-8 grid grid-cols-1 divide-y divide-rule">
            <li
                v-for="(item, i) in props.slide.items"
                :key="i"
                class="flex items-baseline gap-32 py-32"
            >
                <span
                    class="font-display text-h3 text-ink-soft tabular-nums w-[80px]"
                >{{ String(i + 1).padStart(2, "0") }}</span>
                <span class="font-display text-h3 text-ink">{{ item }}</span>
            </li>
        </ol>
    </section>
</template>
