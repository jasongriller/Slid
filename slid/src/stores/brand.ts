import { defineStore } from "pinia";
import type { Brand } from "@slid/schema";
import { applyTheme } from "../design/theme";
import type { ThemeId } from "@slid/schema";

interface BrandState {
    brand: Brand | null;
    theme: ThemeId;
}

export const useBrandStore = defineStore("brand", {
    state: (): BrandState => ({ brand: null, theme: "minimal-mono" }),
    actions: {
        setBrand(brand: Brand) {
            this.brand = brand;
            applyTheme(this.theme, brand.accentColor);
        },
        setTheme(theme: ThemeId) {
            this.theme = theme;
            applyTheme(theme, this.brand?.accentColor);
        },
    },
});
