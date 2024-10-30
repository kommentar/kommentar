type CacheStore = {
  get: (key: string) => unknown | undefined;
  set: (key: string, value: unknown) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export type { CacheStore };
