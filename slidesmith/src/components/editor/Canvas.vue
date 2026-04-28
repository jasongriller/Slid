<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useDeckStore } from "../../stores/deck";
import { fitScale } from "../../design/theme";
import SlideRenderer from "../slides/SlideRenderer.vue";

const deck = useDeckStore();
const wrapper = ref<HTMLDivElement | null>(null);
const scale = ref(0.4);

const updateScale = () => {
    if (!wrapper.value) return;
    const padding = 96;
    const w = wrapper.value.clientWidth - padding * 2;
    const h = wrapper.value.clientHeight - padding * 2;
    scale.value = fitScale(w, h);
};

const transform = computed(() => `scale(${scale.value})`);

onMounted(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
});

onUnmounted(() => {
    window.removeEventListener("resize", updateScale);
});
</script>

<template>
    <div ref="wrapper" class="flex-1 bg-surface flex items-center justify-center overflow-hidden">
        <div
            v-if="deck.currentSlide"
            class="origin-center bg-bg shadow-none"
            :style="{ width: '1920px', height: '1080px', transform }"
        >
            <SlideRenderer :slide="deck.currentSlide" />
        </div>
        <p v-else class="font-body text-ink-soft text-body">No deck loaded.</p>
    </div>
</template>
