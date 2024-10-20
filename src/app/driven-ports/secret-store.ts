type SecretStore = {
  /**
   * Get a secret value by key
   *
   * @param key - The key of the secret
   * @returns The value of the secret
   */
  get: ({ key }: { key: string }) => string | undefined;

  /**
   * Set a secret value by key
   *
   * @param key - The key of the secret
   * @param value - The value of the secret
   */
  _set: ({ key, value }: { key: string; value: string }) => void;
};

export type { SecretStore };
