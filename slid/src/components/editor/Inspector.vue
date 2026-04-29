<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { layoutIds, layoutRegistry } from "@slid/schema";
import { useDeckStore } from "../../stores/deck";
import { useBrandStore } from "../../stores/brand";
import { useSuggestionsStore } from "../../stores/suggestions";
import { regenerateSlide } from "../../ai/api-client";
import SuggestionsPanel from "./SuggestionsPanel.vue";

const deck = useDeckStore();
const brand = useBrandStore();
const suggestions = useSuggestionsStore();

const current = computed(() => deck.currentSlide);
const activeTab = ref<"inspector" | "suggestions">("inspector");

const accentInput = ref(brand.brand?.accentColor ?? "#0A0A0A");

const setAccent = () => {
    brand.setBrand({ ...(brand.brand ?? { name: "Brand" }), accentColor: accentInput.value });
};

const onRegenerate = async () => {
    if (!deck.deck || !current.value) return;
    const next = await regenerateSlide(deck.deck.id, deck.selectedSlide);
    if (next) deck.replaceSlide(deck.selectedSlide, next);
};

// Trigger AI suggestions when slide changes
watch(
    () => ({ slide: deck.currentSlide, index: deck.selectedSlide }),
    async (newVal) => {
        if (!deck.deck || !newVal.slide) {
            suggestions.clearSuggestions();
            return;
        }
        // Debounce suggestions fetch slightly to avoid rapid calls
        await suggestions.fetchSuggestions(deck.deck.id, newVal.index, newVal.slide);
    },
    { immediate: true },
);
</script>

<template>
    <aside class="w-[320px] shrink-0 border-l border-rule bg-bg flex flex-col">
        <!-- Tab Header -->
        <header class="px-24 py-16 border-b border-rule space-y-12">
            <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">
                Inspector
            </p>
            <div class="flex gap-8 border-b border-rule -mx-24 px-24">
                <button
                    @click="activeTab = 'inspector'"
                    :class="[
                        'py-8 text-body font-body uppercase tracking-widest whitespace-nowrap',
                        activeTab === 'inspector'
                            ? 'text-ink border-b-2 border-ink'
                            : 'text-ink-soft hover:text-ink',
                    ]"
                >
                    Properties
                </button>
                <button
                    @click="activeTab = 'suggestions'"
                    :class="[
                        'py-8 text-body font-body uppercase tracking-widest whitespace-nowrap',
                        activeTab === 'suggestions'
                            ? 'text-ink border-b-2 border-ink'
                            : 'text-ink-soft hover:text-ink',
                    ]"
                >
                    AI Suggestions
                    <span v-if="suggestions.activeSuggestions.length > 0" class="ml-4">
                        ({{ suggestions.activeSuggestions.length }})
                    </span>
                </button>
            </div>
        </header>

        <!-- Properties Tab -->
        <template v-if="activeTab === 'inspector'">
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
        </template>

        <!-- Suggestions Tab -->
        <template v-else>
            <div class="flex-1 overflow-y-auto">
                <SuggestionsPanel />
            </div>
        </template>
    </aside>
</template>
