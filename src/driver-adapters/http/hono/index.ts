import type { Hono } from "hono";
import { getHttpAppHono } from "./app.js";
import { getHonoServer } from "./server.js";
import type { App } from "../../../app/domain/entities/app.js";
import type { ServerType } from "@hono/node-server";
import type { Config } from "../../../app/driven-ports/config.js";

type GetHttpHono = ({ app, config }: { app: App; config: Config["http"] }) => {
  app: Hono;
  server: ServerType;
};

const getHttpHono: GetHttpHono = ({ app, config }) => {
  const httpApp = getHttpAppHono({ app });
  const httpServer = getHonoServer({ app: httpApp, port: config.port });

  return {
    app: httpApp,
    server: httpServer,
  };
};

export { getHttpHono };
