import { getApp } from "./app/index.js";
import { wheneverCommentCreatedInvalidateCache } from "./app/domain/policies/whenever-comment-created-invalidate-cache.js";
import { wheneverCommentDeletedInvalidateCache } from "./app/domain/policies/whenever-comment-deleted-invalidate-cache.js";
import { wheneverCommentUpdatedInvalidateCache } from "./app/domain/policies/whenever-comment-updated-invalidate-cache.js";
import { getCacheStoreInMemory } from "./driven-adapters/cache-store/in-memory/index.js";
import { getConfigStaticEnv } from "./driven-adapters/config/static-env/index.js";
import { getDataStorePostgres } from "./driven-adapters/data-store/postgres/index.js";
import { getEventBrokerInMemory } from "./driven-adapters/event-broker/in-memory.js";
import { getProfanityClientApi } from "./driven-adapters/profanity-client/profanity-api/index.js";
import { getRandomIdUuid } from "./driven-adapters/random-id/uuid/index.js";
import { getSecretStoreEnv } from "./driven-adapters/secrets/env/index.js";
import { getHttpHonoZodOpenApi } from "./driver-adapters/http/hono-zod-openapi/index.js";
import { getNodeArgv } from "./utils/node.js";

const config = getConfigStaticEnv();
const secretStore = getSecretStoreEnv();
const eventBroker = getEventBrokerInMemory();
const randomId = getRandomIdUuid();
const cacheStore = getCacheStoreInMemory();
const profanityClient = getProfanityClientApi();

const shouldMigrate = getNodeArgv("--migrate") ? false : true;
const dataStore = await getDataStorePostgres({
  config: config.dataStore,
  secretStore,
  randomId,
  shouldMigrate,
});

if (getNodeArgv("--migrate") === "up") {
  console.log("Running migrations...");
  await dataStore.migrateAll();
  process.exit(0);
} else if (getNodeArgv("--migrate") === "down") {
  console.log("Rolling back migrations...");
  await dataStore.rollbackAll();
  process.exit(0);
}

wheneverCommentCreatedInvalidateCache({ eventBroker, cacheStore });
wheneverCommentUpdatedInvalidateCache({ eventBroker, cacheStore });
wheneverCommentDeletedInvalidateCache({ eventBroker, cacheStore });

const app = getApp({
  dataStore,
  eventBroker,
  randomId,
  cacheStore,
  profanityClient,
});

const hono = getHttpHonoZodOpenApi({ app, config: config.http, randomId });

// * when running a dev server, tsx will force kill the process. (https://github.com/privatenumber/tsx/issues/586)
const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  eventBroker.stop();
  await dataStore.stop();
  profanityClient.stop();
  hono.server.close(() => {
    console.log("Http server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 9500);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", async (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  await gracefulShutdown("unhandledRejection");
});
