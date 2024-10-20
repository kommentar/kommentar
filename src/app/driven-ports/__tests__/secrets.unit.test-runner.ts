import { beforeAll, describe, expect, it } from "vitest";
import type { SecretStore } from "../secret-store.js";

const runSecretStoreTests = (secrets: SecretStore) => {
  beforeAll(() => {
    secrets._set({ key: "apiKey", value: "12345" });
    secrets._set({ key: "dbPassword", value: "password123" });
  });

  describe("Secrets Port Tests", () => {
    it("should get a secret value by key", () => {
      const apiKey = secrets.get({ key: "apiKey" });
      expect(apiKey).toBe("12345");

      const dbPassword = secrets.get({ key: "dbPassword" });
      expect(dbPassword).toBe("password123");
    });

    it("should return undefined for a non-existent key", () => {
      const nonExistent = secrets.get({ key: "nonExistent" });
      expect(nonExistent).toBeUndefined();
    });
  });
};

export { runSecretStoreTests };
