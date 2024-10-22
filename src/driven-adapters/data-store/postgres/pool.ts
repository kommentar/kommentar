import type { Config } from "../../../app/driven-ports/config.js";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";
import pg from "pg";

const { Pool } = pg;

type GetPgPool = ({
  config,
  secretStore,
}: {
  config: Config["dataStore"];
  secretStore: SecretStore;
}) => pg.Pool;

const getPgPool: GetPgPool = ({ config, secretStore }) => {
  const pgPool = new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: secretStore.get({ key: "POSTGRES_USER" }),
    password: secretStore.get({ key: "POSTGRES_PASSWORD" }),
  });

  return pgPool;
};

export { getPgPool };
