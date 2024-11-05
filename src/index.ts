import { getApp } from "./app/index.js";
import { wheneverCommentCreatedInvalidateCache } from "./app/policies/whenever-comment-created-invalidate-cache.js";
import { wheneverCommentDeletedInvalidateCache } from "./app/policies/whenever-comment-deleted-invalidate-cache.js";
import { wheneverCommentUpdatedInvalidateCache } from "./app/policies/whenever-comment-updated-invalidate-cache.js";
import { getCacheStoreInMemory } from "./driven-adapters/cache-store/in-memory/index.js";
import { getConfigStaticEnv } from "./driven-adapters/config/static-env/index.js";
import { getDataStorePostgres } from "./driven-adapters/data-store/postgres/index.js";
import { getEventBrokerInMemory } from "./driven-adapters/event-broker/in-memory.js";
import { getProfanityClientApi } from "./driven-adapters/profanity-client/profanity-api/index.js";
import { getRandomIdUuid } from "./driven-adapters/random-id/uuid/index.js";
import { getSecretStoreEnv } from "./driven-adapters/secrets/env/index.js";
import { getHttpHonoZodOpenApi } from "./driver-adapters/http/hono-zod-openapi/index.js";

const config = getConfigStaticEnv();
const secretStore = getSecretStoreEnv();
const eventBroker = getEventBrokerInMemory();
const randomId = getRandomIdUuid();
const cacheStore = getCacheStoreInMemory();
const profanityClient = getProfanityClientApi();

const dataStore = await getDataStorePostgres({
  config: config.dataStore,
  secretStore,
  randomId,
});

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
