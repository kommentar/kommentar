import { beforeEach, describe, expect, it } from "vitest";
import type { CacheStore } from "../cache-store.js";

const mockKey = "testKey";
const mockValue = "testValue";

const runCacheStoreTests = (cacheStore: CacheStore) => {
  describe("CacheStore Port Tests", () => {
    beforeEach(() => {
      cacheStore.clear();
    });

    it("should set and get a value by key", () => {
      cacheStore.set(mockKey, mockValue);
      const value = cacheStore.get(mockKey);
      expect(value).toBe(mockValue);
    });

    it("should return null for a non-existent key", () => {
      const value = cacheStore.get("nonExistentKey");
      expect(value).toBeUndefined();
    });

    it("should remove a value by key", () => {
      cacheStore.set(mockKey, mockValue);
      cacheStore.remove(mockKey);
      const value = cacheStore.get(mockKey);
      expect(value).toBeUndefined();
    });

    it("should clear all values", () => {
      cacheStore.set(mockKey, mockValue);
      cacheStore.clear();
      const value = cacheStore.get(mockKey);
      expect(value).toBeUndefined();
    });
  });
};

export { runCacheStoreTests };
