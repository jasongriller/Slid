<script setup lang="ts">
import { computed, ref } from "vue";
import { layoutIds, layoutRegistry } from "@slidesmith/schema";
import { useDeckStore } from "../../stores/deck";
import { useBrandStore } from "../../stores/brand";
import { regenerateSlide } from "../../ai/api-client";

const deck = useDeckStore();
const brand = useBrandStore();

const current = computed(() => deck.currentSlide);

const accentInput = ref(brand.brand?.accentColor ?? "#0A0A0A");

const setAccent = () => {
    brand.setBrand({ ...(brand.brand ?? { name: "Brand" }), accentColor: accentInput.value });
};

const onRegenerate = async () => {
    if (!deck.deck || !current.value) return;
    const next = await regenerateSlide(deck.deck.id, deck.selectedSlide);
    if (next) deck.replaceSlide(deck.selectedSlide, next);
};
</script>

<template>
    <aside class="w-[320px] shrink-0 border-l border-rule bg-bg flex flex-col">
        <header class="px-24 py-16 border-b border-rule">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">
                Inspector
            </p>
        </header>
        <section class="px-24 py-24 border-b border-rule">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-16">
                Layout
            </p>
            <p class="font-display text-h3 mb-16">
                {{ current ? layoutRegistry[current.layout]?.label : "—" }}
            </p>
            <p v-if="current" class="text-body text-ink-soft">
                {{ layoutRegistry[current.layout]?.description }}
            </p>
        </section>
        <section class="px-24 py-24 border-b border-rule">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-16">
                Available layouts
            </p>
            <ul class="space-y-8">
                <li v-for="id in layoutIds" :key="id" class="flex items-baseline justify-between">
                    <span class="text-body text-ink">{{ layoutRegistry[id]?.label }}</span>
                    <span class="text-eyebrow uppercase tracking-widest text-ink-soft">{{ id }}</span>
                </li>
            </ul>
        </section>
        <section class="px-24 py-24 border-b border-rule space-y-12">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">
                Actions
            </p>
            <button class="text-body text-ink" @click="onRegenerate">Regenerate slide</button>
        </section>
        <section class="px-24 py-24 space-y-12">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">
                Brand accent
            </p>
            <div class="flex gap-8 items-center">
                <input
                    type="color"
                    v-model="accentInput"
                    class="w-32 h-32 border border-rule"
                />
                <button class="text-body text-ink" @click="setAccent">Apply</button>
            </div>
        </section>
    </aside>
</template>
