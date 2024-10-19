import config from "./vitest.config.mjs";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  config,
  defineConfig({
    test: {
      include: ["**/*.integration.{test,spec}.?(c|m)[jt]s?(x)"],
    },
  }),
);
