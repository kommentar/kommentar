import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.mjs", "src/**/*.ts"],
      exclude: [...configDefaults.coverage.exclude, "src/**/types.ts"],
    },
  },
});
