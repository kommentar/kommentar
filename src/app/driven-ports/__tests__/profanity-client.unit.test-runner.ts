import { describe, expect, it } from "vitest";
import type { ProfanityClient } from "../profanity-client.js";

const runProfanityClientUnitTests = (client: ProfanityClient) => {
  describe("Profanity Client Port Tests", () => {
    it("should return 'CLEAN' for a clean text", async () => {
      const result = await client.check("Hello, world!");
      expect(result).toEqual("CLEAN");
    });

    it("should return 'PROFANE' for a profane text", async () => {
      const result = await client.check("bum hole");
      expect(result).toEqual("PROFANE");
    });
  });
};

export { runProfanityClientUnitTests };
