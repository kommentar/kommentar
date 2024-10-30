import { describe } from "vitest";
import { getCacheStoreInMemory } from "../in-memory/index.js";
import { runCacheStoreTests } from "../../../app/driven-ports/__tests__/cache-store.unit.test-runner.js";

describe("DataStoreInMemory", () => {
  const cacheStore = getCacheStoreInMemory();
  runCacheStoreTests(cacheStore);
});
