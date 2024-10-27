import { getApp } from "./app/index.js";
import { getConfigStaticEnv } from "./driven-adapters/config/static-env/index.js";
import { getDataStorePostgres } from "./driven-adapters/data-store/postgres/index.js";
import { getEventBrokerInMemory } from "./driven-adapters/event-broker/in-memory.js";
import { getRandomIdUuid } from "./driven-adapters/random-id/uuid/index.js";
import { getSecretStoreEnv } from "./driven-adapters/secrets/env/index.js";
import { getHttpHono } from "./driver-adapters/http/hono/index.js";

const config = getConfigStaticEnv();
const secretStore = getSecretStoreEnv();
const eventBroker = getEventBrokerInMemory();
const randomId = getRandomIdUuid();

const dataStore = await getDataStorePostgres({
  config: config.dataStore,
  secretStore,
  randomId,
});

const app = getApp({ dataStore, eventBroker, randomId });

const hono = getHttpHono({ app, config: config.http });

// * when running a dev server, tsx will force kill the process. (https://github.com/privatenumber/tsx/issues/586)
const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  hono.server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });

  // If after 10 seconds, forcefully shut down
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});
