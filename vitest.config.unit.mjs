import config from "./vitest.config.mjs";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  config,
  defineConfig({
    test: {
      include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
      exclude: ["**/*.integration.{test,spec}.?(c|m)[jt]s?(x)"],
    },
  }),
);
