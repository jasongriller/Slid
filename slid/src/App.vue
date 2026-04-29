<script setup lang="ts">
import { useThemeStore } from "./stores/theme";

// Initialize theme store to apply saved theme on app load
const themeStore = useThemeStore();
</script>

<template>
    <router-view />
</template>
