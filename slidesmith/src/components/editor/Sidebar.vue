<script setup lang="ts">
import { ref } from "vue";
import { useDeckStore } from "../../stores/deck";
import SlideRenderer from "../slides/SlideRenderer.vue";

const deck = useDeckStore();
const dragIndex = ref<number | null>(null);

const onDragStart = (i: number) => {
    dragIndex.value = i;
};

const onDrop = (i: number) => {
    if (dragIndex.value === null || dragIndex.value === i) return;
    deck.reorderSlides(dragIndex.value, i);
    dragIndex.value = null;
};
</script>

<template>
    <aside class="w-[280px] shrink-0 border-r border-rule bg-surface flex flex-col">
        <header class="px-24 py-16 border-b border-rule">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">
                Slides
            </p>
        </header>
        <ol class="flex-1 overflow-y-auto px-16 py-16 space-y-16">
            <li
                v-for="(slide, i) in deck.deck?.slides ?? []"
                :key="i"
                draggable="true"
                @dragstart="onDragStart(i)"
                @dragover.prevent
                @drop="onDrop(i)"
                @click="deck.select(i)"
                :class="[
                    'cursor-pointer relative aspect-[16/9] bg-bg overflow-hidden',
                    deck.selectedSlide === i ? 'ring-2 ring-ink' : 'ring-1 ring-rule',
                ]"
            >
                <div
                    class="absolute top-0 left-0 origin-top-left"
                    style="transform: scale(0.13); width: 1920px; height: 1080px;"
                >
                    <SlideRenderer :slide="slide" />
                </div>
                <span
                    class="absolute top-8 left-8 font-body text-eyebrow text-ink-soft tabular-nums"
                >{{ String(i + 1).padStart(2, "0") }}</span>
            </li>
        </ol>
    </aside>
</template>
