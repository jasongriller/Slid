<script setup lang="ts">
import { onMounted } from "vue";
import { useDeckStore } from "../stores/deck";
import { sampleDeck } from "../stores/sampleDeck";
import SlideRenderer from "../components/slides/SlideRenderer.vue";

const deck = useDeckStore();

onMounted(() => {
    if (!deck.deck) deck.setDeck(sampleDeck);
});
</script>

<template>
    <div v-if="deck.deck" class="bg-bg">
        <SlideRenderer
            v-for="(slide, i) in deck.deck.slides"
            :key="i"
            :slide="slide"
        />
    </div>
</template>
