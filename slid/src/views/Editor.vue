<script setup lang="ts">
import { onMounted } from "vue";
import { useDeckStore } from "../stores/deck";
import { sampleDeck } from "../stores/sampleDeck";
import Toolbar from "../components/editor/Toolbar.vue";
import Sidebar from "../components/editor/Sidebar.vue";
import Canvas from "../components/editor/Canvas.vue";
import Inspector from "../components/editor/Inspector.vue";

const deck = useDeckStore();

onMounted(() => {
    if (!deck.deck) deck.setDeck(sampleDeck);
});
</script>

<template>
    <div class="h-screen flex flex-col bg-bg">
        <Toolbar />
        <div class="flex-1 flex min-h-0">
            <Sidebar />
            <Canvas />
            <Inspector />
        </div>
    </div>
</template>
