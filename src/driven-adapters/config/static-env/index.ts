import type { Config } from "../../../app/driven-ports/config.js";

type GetConfigStaticEnv = () => Config;

const getConfigStaticEnv: GetConfigStaticEnv = () => {
  return {
    http: {
      port: Number(process.env.PORT) || 3000,
    },
    dataStore: {
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT) || 5432,
    },
  };
};

export { getConfigStaticEnv };
