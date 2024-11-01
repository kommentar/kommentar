type CacheStore = {
  get: (key: string) => unknown | unknown[] | undefined;
  set: (key: string, value: unknown) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export type { CacheStore };
