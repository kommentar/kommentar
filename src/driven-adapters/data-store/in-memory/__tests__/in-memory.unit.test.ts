import { describe } from "vitest";
import { runDataStoreTests } from "../../../../app/driven-ports/__tests__/data-store.unit.test-runner.js";
import { getDataStoreInMemory } from "../index.js";

describe("DataStoreInMemory", () => {
  const dataStore = getDataStoreInMemory();
  runDataStoreTests(dataStore);
});
