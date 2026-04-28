<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDeckStore } from "../stores/deck";
import { generateDeck, type GenerateBrief } from "../ai/api-client";
import { sampleDeck } from "../stores/sampleDeck";

const router = useRouter();
const deck = useDeckStore();

const topic = ref("AI proposal generator for design-led agencies");
const audience = ref("Heads of design at Series B+ SaaS companies");
const tone = ref("Confident, restrained, intentional");
const slideCount = ref(8);
const loading = ref(false);
const error = ref<string | null>(null);

const onGenerate = async () => {
    loading.value = true;
    error.value = null;
    try {
        const brief: GenerateBrief = {
            topic: topic.value,
            audience: audience.value,
            tone: tone.value,
            slideCount: slideCount.value,
        };
        const generated = await generateDeck(brief);
        deck.setDeck(generated);
        router.push({ name: "editor", params: { id: generated.id } });
    } catch (e) {
        error.value = (e as Error).message;
    } finally {
        loading.value = false;
    }
};

const onUseSample = () => {
    deck.setDeck(sampleDeck);
    router.push({ name: "editor", params: { id: sampleDeck.id } });
};
</script>

<template>
    <main class="min-h-screen bg-bg flex items-center">
        <div class="grid grid-cols-12 gap-64 w-full px-128">
            <header class="col-span-5 flex flex-col justify-center">
                <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft mb-32">
                    Slidesmith · Minimal Mono
                </p>
                <h1 class="font-display text-h2 font-semibold tracking-tight">
                    Proposal-quality slide decks, designed by AI that respects a design system.
                </h1>
                <p class="mt-32 text-body text-ink-muted max-w-[520px]">
                    Slidesmith picks layouts the way a designer would, fills them with
                    structured content, and renders pixel-perfect 1920×1080 slides — no
                    Lorem-Ipsum vibes, no generic templates.
                </p>
            </header>

            <form
                class="col-span-7 grid grid-cols-1 gap-24 max-w-[720px]"
                @submit.prevent="onGenerate"
            >
                <label class="grid gap-8">
                    <span class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">Topic</span>
                    <input v-model="topic" class="text-body bg-transparent border-b border-ink py-8 outline-none" />
                </label>
                <label class="grid gap-8">
                    <span class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">Audience</span>
                    <input v-model="audience" class="text-body bg-transparent border-b border-ink py-8 outline-none" />
                </label>
                <label class="grid gap-8">
                    <span class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">Tone</span>
                    <input v-model="tone" class="text-body bg-transparent border-b border-ink py-8 outline-none" />
                </label>
                <label class="grid gap-8">
                    <span class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">Slide count</span>
                    <input
                        v-model.number="slideCount"
                        type="number"
                        min="3"
                        max="40"
                        class="text-body bg-transparent border-b border-ink py-8 outline-none w-[120px]"
                    />
                </label>
                <div class="flex items-center gap-24 mt-16">
                    <button
                        type="submit"
                        :disabled="loading"
                        class="text-body text-ink border-b border-ink pb-4 disabled:text-ink-soft disabled:border-rule"
                    >{{ loading ? "Generating…" : "Generate deck" }}</button>
                    <button
                        type="button"
                        class="text-body text-ink-soft"
                        @click="onUseSample"
                    >Use sample deck</button>
                </div>
                <p v-if="error" class="text-body text-ink-soft">{{ error }}</p>
            </form>
        </div>
    </main>
</template>
