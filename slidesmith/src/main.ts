import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import { applyTheme } from "./design/theme";
import "./design/index.css";

applyTheme("minimal-mono");

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
