import { type CustomHonoEnv, getHttpAppHonoZodOpenApi } from "./app.js";
import type { App } from "../../../app/domain/entities/app.js";
import type { Config } from "../../../app/driven-ports/config.js";
import type { DataStore } from "../../../app/driven-ports/data-store.js";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";
import type { ServerType } from "@hono/node-server";
import { getHonoZodOpenApiServer } from "./server.js";

type GetHttpHonoZodOpenApi = ({
  app,
  config,
  randomId,
  dataStore,
  secretStore,
}: {
  app: App;
  config: Config["http"];
  randomId: RandomId;
  dataStore: DataStore;
  secretStore: SecretStore;
}) => {
  app: OpenAPIHono<CustomHonoEnv>;
  server: ServerType;
};

const getHttpHonoZodOpenApi: GetHttpHonoZodOpenApi = ({
  app,
  config,
  randomId,
  dataStore,
  secretStore,
}) => {
  const httpApp = getHttpAppHonoZodOpenApi({
    app,
    randomId,
    dataStore,
    secretStore,
  });
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
