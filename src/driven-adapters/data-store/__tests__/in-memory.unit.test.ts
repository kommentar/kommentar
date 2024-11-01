import { describe } from "vitest";
import { getDataStoreInMemory } from "../in-memory/index.js";
import { runDataStoreTests } from "../../../app/driven-ports/__tests__/data-store.unit.test-runner.js";

describe("DataStoreInMemory", () => {
  const dataStore = getDataStoreInMemory();
  runDataStoreTests(dataStore);
});
