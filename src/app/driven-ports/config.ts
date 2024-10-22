type HttpConfig = {
  port: number;
};

type DataStorePostgresConfig = {
  host: string;
  port: number;
  database: string;
};

type Config = {
  http: HttpConfig;
  dataStore: DataStorePostgresConfig;
};

export type { Config };
