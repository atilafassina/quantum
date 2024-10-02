import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      all: true,
      exclude: ["bin"],
      include: ["src"],
      reporter: ["html", "lcov"],
    },
    exclude: ["bin", "node_modules"],
  },
});
