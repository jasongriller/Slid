<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDeckStore } from "../stores/deck";
import { useThemeStore } from "../stores/theme";
import { generateDeck, type GenerateBrief } from "../ai/api-client";
import { sampleDeck } from "../stores/sampleDeck";

const router = useRouter();
const deck = useDeckStore();
const themeStore = useThemeStore();

const topic = ref("AI proposal generator for design-led agencies");
const audience = ref("Heads of design at Series B+ SaaS companies");
const tone = ref("Confident, restrained, intentional");
const slideCount = ref(8);
const loading = ref(false);
const error = ref<string | null>(null);

const features = [
    {
        icon: "sparkles",
        title: "AI Co-Creator",
        description: "Real-time AI suggestions for layouts, content, and design as you edit.",
        status: "active"
    },
    {
        icon: "chat",
        title: "Natural Language",
        description: "Describe what you want and get a fully-formed, styled slide instantly.",
        status: "planned"
    },
    {
        icon: "chart",
        title: "Live Data Slides",
        description: "Connect to live data sources. Metrics refresh automatically.",
        status: "planned"
    },
    {
        icon: "palette",
        title: "Infinite Canvas",
        description: "Figma-like canvas for non-linear editing and exploration.",
        status: "planned"
    },
    {
        icon: "rocket",
        title: "Multi-Format Export",
        description: "Export to web, mobile, VR, video, and dashboard formats.",
        status: "planned"
    },
    {
        icon: "users",
        title: "Real-Time Collab",
        description: "Multiple users editing with live cursors and comments.",
        status: "planned"
    },
];

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
    <main class="min-h-screen bg-bg relative overflow-hidden">
        <!-- Background Effects -->
        <div class="glow-orb glow-orb-primary w-[800px] h-[800px] -top-[300px] -left-[300px] animate-pulse-glow"></div>
        <div class="glow-orb glow-orb-secondary w-[600px] h-[600px] top-[30%] -right-[200px] animate-float"></div>
        <div class="glow-orb glow-orb-tertiary w-[500px] h-[500px] bottom-[5%] left-[20%] opacity-40"></div>
        
        <!-- Grid overlay -->
        <div class="absolute inset-0 grid-lines opacity-30 pointer-events-none"></div>

        <!-- Navigation -->
        <nav class="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
            <div class="flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-accent">
                    <span class="text-white font-bold text-xl">S</span>
                </div>
                <span class="font-display text-xl font-semibold text-ink">Slid</span>
            </div>
            
            <div class="hidden md:flex items-center gap-2">
                <button class="nav-pill active">Dashboard</button>
                <button class="nav-pill">Templates</button>
                <button class="nav-pill">Docs</button>
            </div>
            
            <div class="flex items-center gap-3">
                <!-- Theme Toggle -->
                <button 
                    class="theme-toggle"
                    @click="themeStore.toggleTheme()"
                    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                >
                    <!-- Sun icon (shown in dark mode) -->
                    <svg v-if="themeStore.isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <!-- Moon icon (shown in light mode) -->
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
                <button class="btn-secondary text-sm py-2 px-5">Sign In</button>
                <button class="btn-primary text-sm py-2 px-5">Get Started</button>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative z-10 px-6 lg:px-12 pt-12 pb-20 lg:pt-16 lg:pb-28">
            <div class="max-w-7xl mx-auto">
                <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    <!-- Left: Hero Content -->
                    <div class="lg:col-span-5 space-y-8 pt-8">
                        <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full glass text-sm">
                            <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            <span class="text-ink-muted">AI-Powered Design Tool</span>
                        </div>
                        
                        <h1 class="font-display text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                            <span class="text-ink">Create</span>
                            <br />
                            <span class="gradient-text">stunning decks</span>
                            <br />
                            <span class="text-ink">in seconds</span>
                        </h1>
                        
                        <p class="text-lg text-ink-soft max-w-md leading-relaxed">
                            Slid picks layouts like a designer, fills them with structured content, 
                            and renders pixel-perfect 1920×1080 slides.
                        </p>

                        <!-- Stats Row -->
                        <div class="flex gap-10 pt-4">
                            <div>
                                <div class="stat-value">10x</div>
                                <div class="stat-label">Faster</div>
                            </div>
                            <div>
                                <div class="stat-value">1080p</div>
                                <div class="stat-label">Quality</div>
                            </div>
                            <div>
                                <div class="stat-value">AI</div>
                                <div class="stat-label">Powered</div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="flex flex-wrap gap-4 pt-4">
                            <button 
                                class="btn-primary"
                                @click="onUseSample"
                            >
                                <span class="flex items-center gap-2">
                                    <span>Try Demo</span>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                            <button class="btn-secondary">
                                Watch Video
                            </button>
                        </div>
                    </div>

                    <!-- Right: Generator Card -->
                    <div class="lg:col-span-7">
                        <div class="glass-elevated rounded-3xl p-8 lg:p-10 relative">
                            <!-- Card accent line -->
                            <div class="absolute top-0 left-8 right-8 h-[2px] bg-gradient-primary rounded-full"></div>
                            
                            <div class="flex items-center justify-between mb-8">
                                <div>
                                    <h2 class="text-2xl font-semibold text-ink">Generate Deck</h2>
                                    <p class="text-ink-soft text-sm mt-1">Describe your presentation</p>
                                </div>
                                <div class="icon-box">
                                    ⚡
                                </div>
                            </div>

                            <form class="space-y-5" @submit.prevent="onGenerate">
                                <div class="grid md:grid-cols-2 gap-5">
                                    <div class="md:col-span-2">
                                        <label class="input-label">Topic</label>
                                        <input 
                                            v-model="topic" 
                                            class="input-field"
                                            placeholder="What's your presentation about?"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label class="input-label">Target Audience</label>
                                        <input 
                                            v-model="audience" 
                                            class="input-field"
                                            placeholder="Who will be watching?"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label class="input-label">Tone & Style</label>
                                        <input 
                                            v-model="tone" 
                                            class="input-field"
                                            placeholder="e.g., Professional, Bold"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label class="input-label">Slides</label>
                                        <input 
                                            v-model.number="slideCount"
                                            type="number"
                                            min="3"
                                            max="40"
                                            class="input-field"
                                        />
                                    </div>
                                    
                                    <div class="flex items-end">
                                        <button
                                            type="submit"
                                            :disabled="loading"
                                            class="btn-primary w-full"
                                        >
                                            <span v-if="loading" class="flex items-center justify-center gap-2">
                                                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Generating...
                                            </span>
                                            <span v-else class="flex items-center justify-center gap-2">
                                                Generate
                                                <span>✨</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <p v-if="error" class="text-sm bg-accent/10 border border-accent/20 rounded-xl p-4 text-ink-muted">
                                    <span class="text-accent font-medium">Error:</span> {{ error }}
                                </p>
                            </form>

                            <!-- Quick sample option -->
                            <div class="mt-6 pt-6 border-t border-rule flex items-center justify-between">
                                <span class="text-ink-soft text-sm">Want to explore first?</span>
                                <button
                                    type="button"
                                    class="text-accent text-sm font-medium hover:text-accent-light transition-colors"
                                    @click="onUseSample"
                                >
                                    Use Sample Deck →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="relative z-10 px-6 lg:px-12 py-20 lg:py-28">
            <div class="max-w-7xl mx-auto">
                <!-- Section Header -->
                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <div>
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-ink-soft mb-4">
                            <span>🚀</span>
                            <span>ROADMAP</span>
                        </div>
                        <h2 class="font-display text-3xl lg:text-4xl font-bold">
                            <span class="text-ink">The Future of</span>
                            <span class="gradient-text"> Design</span>
                        </h2>
                    </div>
                    <p class="text-ink-soft max-w-md">
                        We're building the next generation of AI-powered presentation tools.
                    </p>
                </div>

                <!-- Features Grid -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div
                        v-for="feature in features"
                        :key="feature.title"
                        :class="[
                            'card group cursor-pointer',
                            feature.status === 'active' ? 'card-featured' : ''
                        ]"
                    >
                        <div class="flex items-start justify-between mb-5">
                            <div class="icon-box">
                                <svg v-if="feature.icon === 'sparkles'" class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <svg v-else-if="feature.icon === 'chat'" class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <svg v-else-if="feature.icon === 'chart'" class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <svg v-else-if="feature.icon === 'palette'" class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                <svg v-else-if="feature.icon === 'rocket'" class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                </svg>
                                <svg v-else-if="feature.icon === 'users'" class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span :class="[
                                'badge',
                                feature.status === 'active' ? 'badge-active' : 'badge-planned'
                            ]">
                                {{ feature.status === 'active' ? 'Active' : 'Soon' }}
                            </span>
                        </div>
                        <h3 class="text-lg font-semibold text-ink mb-2 group-hover:text-accent transition-colors">
                            {{ feature.title }}
                        </h3>
                        <p class="text-ink-soft text-sm leading-relaxed">
                            {{ feature.description }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="relative z-10 px-6 lg:px-12 py-16">
            <div class="max-w-4xl mx-auto">
                <div class="glass-elevated rounded-3xl p-10 lg:p-14 relative overflow-hidden">
                    <!-- Decorative elements -->
                    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 blur-3xl"></div>
                    <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent-secondary opacity-10 blur-3xl"></div>
                    
                    <div class="relative z-10 text-center">
                        <h2 class="font-display text-3xl lg:text-4xl font-bold mb-4">
                            <span class="text-ink">Ready to create</span>
                            <span class="gradient-text"> amazing decks?</span>
                        </h2>
                        <p class="text-ink-soft text-lg mb-8 max-w-lg mx-auto">
                            Join designers and teams creating stunning presentations with AI.
                        </p>
                        <div class="flex flex-wrap justify-center gap-4">
                            <button class="btn-primary" @click="onUseSample">
                                Get Started Free
                            </button>
                            <button class="btn-outline">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="relative z-10 px-6 lg:px-12 py-10 border-t border-rule">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span class="text-white font-bold text-sm">S</span>
                    </div>
                    <span class="text-ink-soft text-sm">© 2024 Slid</span>
                </div>
                <div class="flex items-center gap-8 text-ink-soft text-sm">
                    <a href="#" class="hover:text-accent transition-colors">Privacy</a>
                    <a href="#" class="hover:text-accent transition-colors">Terms</a>
                    <a href="#" class="hover:text-accent transition-colors">Docs</a>
                    <a href="#" class="hover:text-accent transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    </main>
</template>
