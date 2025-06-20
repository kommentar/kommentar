import type { OpenAPIHono } from "@hono/zod-openapi";
import type { App } from "../../../app/domain/entities/app.js";
import type { Config } from "../../../app/driven-ports/config.js";
import type { ServerType } from "@hono/node-server";
import { getHttpAppHonoZodOpenApi, type CustomHonoEnv } from "./app.js";
import { getHonoZodOpenApiServer } from "./server.js";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import type { DataStore } from "../../../app/driven-ports/data-store.js";

type GetHttpHonoZodOpenApi = ({
  app,
  config,
  randomId,
  dataStore,
}: {
  app: App;
  config: Config["http"];
  randomId: RandomId;
  dataStore: DataStore;
}) => {
  app: OpenAPIHono<CustomHonoEnv>;
  server: ServerType;
};

const getHttpHonoZodOpenApi: GetHttpHonoZodOpenApi = ({
  app,
  config,
  randomId,
  dataStore,
}) => {
  const httpApp = getHttpAppHonoZodOpenApi({ app, randomId, dataStore });
  const httpServer = getHonoZodOpenApiServer({
    app: httpApp,
    port: config.port,
  });

  return {
    app: httpApp,
    server: httpServer,
  };
};

export { getHttpHonoZodOpenApi };
