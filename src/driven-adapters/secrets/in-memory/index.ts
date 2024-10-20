import type { SecretStore } from "../../../app/driven-ports/secret-store.js";

type GetSecretsInMemory = () => SecretStore;

const getSecretStoreInMemory: GetSecretsInMemory = () => {
  const secrets = new Map<string, string>();

  return {
    get: ({ key }) => secrets.get(key),
    _set: ({ key, value }) => secrets.set(key, value),
  };
};

export { getSecretStoreInMemory };
