import type {
  DataStore,
  StoredConsumer,
} from "../../../app/driven-ports/data-store.js";
import type { App } from "../../../app/domain/entities/app.js";
import { HTTPException } from "hono/http-exception";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { Scalar } from "@scalar/hono-api-reference";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";
import { getRouter } from "./router/index.js";
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
}: {
  app: App;
  randomId: RandomId;
  dataStore: DataStore;
  secretStore: SecretStore;
}) => OpenAPIHono<CustomHonoEnv>;

const apiClientservers = [
  {
    url: "http://localhost:3000",
    description: "Local development server",
  },
];

const getHttpAppHonoZodOpenApi: GetHttpAppHonoZodOpenApi = ({
  app,
  randomId,
  dataStore,
  secretStore,
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
