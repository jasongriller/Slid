<script setup lang="ts">
import { useDeckStore } from "../../stores/deck";

const deck = useDeckStore();

const exportPdf = async () => {
    if (!deck.deck) return;
    const res = await fetch("/api/exports/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId: deck.deck.id }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.deck.title}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
};
</script>

<template>
    <header
        class="h-[56px] shrink-0 px-24 border-b border-rule flex items-center justify-between bg-bg"
    >
        <p class="font-body text-eyebrow uppercase tracking-widest text-ink-soft">
            Slid
        </p>
        <div class="flex items-center gap-16">
            <button
                class="text-body text-ink disabled:text-ink-soft"
                :disabled="!deck.canUndo"
                @click="deck.undo()"
            >Undo</button>
            <button
                class="text-body text-ink disabled:text-ink-soft"
                :disabled="!deck.canRedo"
                @click="deck.redo()"
            >Redo</button>
            <span aria-hidden="true" class="block w-[1px] h-24 bg-rule"></span>
            <button class="text-body text-ink" @click="exportPdf">Export PDF</button>
        </div>
    </header>
</template>
