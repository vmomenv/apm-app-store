import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "dist-electron/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "src/__tests__/",
        "**/*.spec.ts",
        "**/*.test.ts",
        "electron/",
      ],
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
});
