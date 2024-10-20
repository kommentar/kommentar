import { getApp } from "./app/index.js";
import { getDataStoreInMemory } from "./driven-adapters/data-store/in-memory/index.js";
import { getHttpHono } from "./driver-adapters/http/hono/index.js";

const dataStore = getDataStoreInMemory();
const app = getApp({ dataStore });
const hono = getHttpHono({ app });

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
