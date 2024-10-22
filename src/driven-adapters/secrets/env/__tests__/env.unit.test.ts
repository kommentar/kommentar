import { describe } from "vitest";
import { getSecretStoreEnv } from "../index.js";
import { runSecretStoreTests } from "../../../../app/driven-ports/__tests__/secrets.unit.test-runner.js";

describe("SecretStoreInMemory", () => {
  const secretStore = getSecretStoreEnv();
  runSecretStoreTests(secretStore);
});
