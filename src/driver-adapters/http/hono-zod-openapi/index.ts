import type { OpenAPIHono } from "@hono/zod-openapi";
import type { App } from "../../../app/domain/entities/app.js";
import type { Config } from "../../../app/driven-ports/config.js";
import type { ServerType } from "@hono/node-server";
import { getHttpAppHonoZodOpenApi } from "./app.js";
import { getHonoZodOpenApiServer } from "./server.js";
import type { RandomId } from "../../../app/driven-ports/random-id.js";

type GetHttpHonoZodOpenApi = ({
  app,
  config,
}: {
  app: App;
  config: Config["http"];
  randomId: RandomId;
}) => {
  app: OpenAPIHono;
  server: ServerType;
};

const getHttpHonoZodOpenApi: GetHttpHonoZodOpenApi = ({
  app,
  config,
  randomId,
}) => {
  const httpApp = getHttpAppHonoZodOpenApi({ app, randomId });
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
