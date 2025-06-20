import { defineConfig, mergeConfig } from "vitest/config";
import config from "./vitest.config.mjs";

export default mergeConfig(
  config,
  defineConfig({
    test: {
      include: ["**/*.integration.{test,spec}.?(c|m)[jt]s?(x)"],
    },
  }),
);
