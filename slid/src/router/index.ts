import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: () => import("../views/Home.vue") },
        { path: "/editor/:id", name: "editor", component: () => import("../views/Editor.vue") },
        { path: "/render/:id", name: "render", component: () => import("../views/Render.vue") },
    ],
});
