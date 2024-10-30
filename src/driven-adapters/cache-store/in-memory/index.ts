import type { CacheStore } from "../../../app/driven-ports/cache-store.js";

type GetCacheStoreInMemory = () => CacheStore;

const getCacheStoreInMemory: GetCacheStoreInMemory = () => {
  const cache: Record<string, unknown> = {};

  return {
    get: (key: string) => cache[key] ?? undefined,
    set: (key: string, value: unknown) => {
      cache[key] = value;
    },
    remove: (key: string) => {
      delete cache[key];
    },
    clear: () => {
      for (const key in cache) {
        delete cache[key];
      }
    },
  };
};

export { getCacheStoreInMemory };
