<template>
    <div class="space-y-16">
        <!-- Tab Navigation -->
        <div class="flex gap-8 border-b border-rule">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                    'px-12 py-12 text-body font-body uppercase tracking-widest',
                    activeTab === tab.id
                        ? 'text-ink border-b-2 border-ink'
                        : 'text-ink-soft hover:text-ink',
                ]"
            >
                {{ tab.label }}
                <span v-if="tab.count > 0" class="ml-4 text-eyebrow">({{ tab.count }})</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="suggestions.isLoading" class="px-24 py-24 text-center">
            <p class="text-body text-ink-soft">Analyzing slide...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="suggestions.error" class="px-24 py-24 bg-surface rounded">
            <p class="text-body text-ink-soft">{{ suggestions.error }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="activeTab !== 'all' && activeSuggestionsOfType.length === 0" class="px-24 py-24">
            <p class="text-body text-ink-soft">No {{ activeTab }} suggestions at this time.</p>
        </div>

        <!-- Suggestions List -->
        <div v-else class="space-y-12 px-24">
            <div
                v-for="suggestion in activeSuggestionsOfType"
                :key="suggestion.id"
                class="p-16 border border-rule rounded bg-surface space-y-12 hover:border-ink transition-colors"
            >
                <!-- Header -->
                <div class="flex items-start justify-between gap-12">
                    <div class="flex-1">
                        <div class="flex items-center gap-8">
                            <span class="inline-flex items-center px-8 py-4 bg-ink text-bg text-eyebrow rounded">
                                {{ suggestion.type }}
                            </span>
                            <span
                                v-if="suggestion.priority === 'high'"
                                class="inline-flex items-center px-8 py-4 bg-surface text-ink text-eyebrow rounded border border-ink"
                            >
                                Priority
                            </span>
                        </div>
                        <h4 class="text-h5 mt-8 mb-4">{{ suggestion.title }}</h4>
                        <p class="text-body text-ink-soft">{{ suggestion.description }}</p>
                    </div>
                </div>

                <!-- Action Details (type-specific) -->
                <div v-if="suggestion.type === 'layout'" class="pl-16 border-l border-rule py-8">
                    <p class="text-eyebrow uppercase tracking-widest text-ink-soft mb-4">
                        Recommended Layout
                    </p>
                    <p class="text-body font-mono">{{ suggestion.action.recommendedLayout }}</p>
                    <p class="text-body text-ink-soft mt-4">{{ suggestion.action.reason }}</p>
                </div>

                <div v-else-if="suggestion.type === 'content'" class="pl-16 border-l border-rule py-8">
                    <p class="text-eyebrow uppercase tracking-widest text-ink-soft mb-4">
                        Improvements
                    </p>
                    <ul class="space-y-4">
                        <li v-for="(change, idx) in suggestion.action.changes" :key="idx" class="text-body">
                            • {{ change }}
                        </li>
                    </ul>
                </div>

                <div v-else-if="suggestion.type === 'design'" class="pl-16 border-l border-rule py-8">
                    <p class="text-eyebrow uppercase tracking-widest text-ink-soft mb-4">
                        Design Suggestions
                    </p>
                    <p class="text-body text-ink-soft">{{ suggestion.action.rationale }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-8">
                    <button
                        @click="applySuggestion(suggestion)"
                        class="flex-1 px-12 py-8 bg-ink text-bg text-body rounded hover:bg-ink-soft transition-colors"
                    >
                        Apply
                    </button>
                    <button
                        @click="dismissSuggestion(suggestion.id)"
                        class="flex-1 px-12 py-8 border border-rule text-body rounded hover:bg-surface transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useSuggestionsStore } from "../../stores/suggestions";
import type { Suggestion } from "../../ai/suggestions";

const suggestions = useSuggestionsStore();
const activeTab = ref<"all" | "layout" | "content" | "design">("all");

const tabs = computed(() => [
    { id: "all" as const, label: "All", count: suggestions.activeSuggestions.length },
    { id: "layout" as const, label: "Layout", count: suggestions.byType.layout.length },
    { id: "content" as const, label: "Content", count: suggestions.byType.content.length },
    { id: "design" as const, label: "Design", count: suggestions.byType.design.length },
]);

const activeSuggestionsOfType = computed(() => {
    if (activeTab.value === "all") return suggestions.activeSuggestions;
    return suggestions.byType[activeTab.value];
});

const applySuggestion = async (suggestion: Suggestion) => {
    // For now, just mark as accepted. The actual application will depend on suggestion type.
    // In a full implementation, we'd dispatch actions to apply the suggestion to the slide.
    suggestions.acceptSuggestion(suggestion.id);

    // TODO: Emit event to parent to apply suggestion to actual slide
    // Different logic for layout vs content vs design
};

const dismissSuggestion = (id: string) => {
    suggestions.rejectSuggestion(id);
};
</script>

<style scoped></style>
