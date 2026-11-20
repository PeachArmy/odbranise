import { defineConfig } from "astro/config";

export default defineConfig({
  compressHTML: true,
  i18n: {
    defaultLocale: "mk",
    locales: ["mk"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
