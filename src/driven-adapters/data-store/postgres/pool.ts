import type { GetPgPool } from "./types.js";
import pg from "pg";

const { Pool } = pg;

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
