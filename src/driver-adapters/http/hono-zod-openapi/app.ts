import type {
  DataStore,
  StoredConsumer,
} from "../../../app/driven-ports/data-store.js";
import type { App } from "../../../app/domain/entities/app.js";
import { HTTPException } from "hono/http-exception";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { ProfanityClient } from "../../../app/driven-ports/profanity-client.js";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { Scalar } from "@scalar/hono-api-reference";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";
import { getRouter } from "./router/index.js";
import { healthCheckRoute } from "./router/routes.js";
import { serveStatic } from "@hono/node-server/serve-static";
import { sessionMiddleware } from "./middlewares.js";

export type CustomHonoEnv = {
  Variables: {
    consumer: StoredConsumer;
  };
};

type GetHttpAppHonoZodOpenApi = ({
  app,
  randomId,
  dataStore,
  secretStore,
  profanityClient,
}: {
  app: App;
  randomId: RandomId;
  dataStore: DataStore;
  secretStore: SecretStore;
  profanityClient: ProfanityClient;
}) => OpenAPIHono<CustomHonoEnv>;

type HealthStatus = "healthy" | "unhealthy";
type DataStoreTestHealthFn = (
  dataStore: DataStore,
) => Promise<{ status: HealthStatus; error?: string }>;
type SecretStoreTestHealthFn = (
  secretStore: SecretStore,
) => Promise<{ status: HealthStatus; error?: string }>;
type ProfanityClientTestHealthFn = (
  profanityClient: ProfanityClient,
) => Promise<{ status: HealthStatus; error?: string }>;
type HealthObj = { overallStatus: HealthStatus };

const apiClientservers = [
  {
    url: "http://localhost:3000",
    description: "Local development server",
  },
];

const testDataStoreHealth: DataStoreTestHealthFn = async (dataStore) => {
  try {
    await dataStore.consumer.getCount();
    return { status: "healthy" };
  } catch (error) {
    console.error("DataStore health check failed:", error);
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const testSecretStoreHealth: SecretStoreTestHealthFn = async (secretStore) => {
  try {
    secretStore.get({ key: "__health_check__" });
    return { status: "healthy" };
  } catch (error) {
    console.error("SecretStore health check failed:", error);
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const testProfanityClientHealth: ProfanityClientTestHealthFn = async (
  profanityClient,
) => {
  try {
    const foo = await profanityClient.check("this is not profane.");
    const bar = await profanityClient.check("what a bunch of bullcrap");

    if (foo === "CLEAN" && bar === "PROFANE") {
      return { status: "healthy" };
    }

    return { status: "unhealthy" };
  } catch (error) {
    console.error("ProfanityClient health check failed:", error);
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const getHttpAppHonoZodOpenApi: GetHttpAppHonoZodOpenApi = ({
  app,
  randomId,
  dataStore,
  secretStore,
  profanityClient,
}) => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.PRODUCTION_API_SERVER_URL
  ) {
    apiClientservers[0] = {
      url: String(process.env.PRODUCTION_API_SERVER_URL),
      description: "Production server",
    };
  }

  const hono = new OpenAPIHono<CustomHonoEnv>();

  const { apiRouter, superRouter } = getRouter({ app, dataStore, secretStore });

  hono.use(sessionMiddleware(randomId));

  // Documentation
  hono.doc("/spec", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Kommentar | OpenAPI Specification",
    },
  });

  hono.get(
    "/reference",
    Scalar({
      pageTitle: "Kommentar | API Reference",
      servers: apiClientservers,
      url: "/spec",
      defaultOpenAllTags: true,
      favicon: "/favicon.ico",
    }),
  );

  hono.use(
    "/favicon.ico",
    serveStatic({
      root: "./src/driver-adapters/http/hono-zod-openapi",
      path: "./favicon.ico",
    }),
  );

  hono.route("/super", superRouter);
  hono.route("/api", apiRouter);

  hono.openapi(healthCheckRoute, async (c) => {
    const timestamp = new Date().toISOString();
    const health: HealthObj = {
      overallStatus: "healthy",
    };

    const dataStoreHealth = await testDataStoreHealth(dataStore);
    if (dataStoreHealth.status === "unhealthy") {
      health.overallStatus = "unhealthy";
    }

    const secretStoreHealth = await testSecretStoreHealth(secretStore);
    if (secretStoreHealth.status === "unhealthy") {
      health.overallStatus = "unhealthy";
    }

    const profanityClientHealth =
      await testProfanityClientHealth(profanityClient);
    if (profanityClientHealth.status === "unhealthy") {
      health.overallStatus = "unhealthy";
    }

    const response = {
      status: health.overallStatus,
      timestamp,
      dependencies: {
        dataStore: dataStoreHealth,
        secretStore: secretStoreHealth,
        profanityClient: profanityClientHealth,
      },
    };

    const statusCode = health.overallStatus === "healthy" ? 200 : 503;
    return c.json(response, statusCode);
  });

  hono.onError((err, c) => {
    if (err instanceof HTTPException) {
      console.log("HTTP Exception:", err);
      return err.getResponse();
    }

    console.error("Unhandled error:", err);
    return c.json({ message: "Internal server error" }, 500);
  });

  return hono;
};

export { getHttpAppHonoZodOpenApi };
