import type { Hono } from "hono";
import { getHttpAppHono } from "./app.js";
import { getHonoServer } from "./server.js";
import type { App } from "../../../app/domain/entities/app.js";
import type { ServerType } from "@hono/node-server";

type GetHttpHono = ({ app }: { app: App }) => { app: Hono; server: ServerType };

const getHttpHono: GetHttpHono = ({ app }) => {
  const httpApp = getHttpAppHono({ app });
  const httpServer = getHonoServer({ app: httpApp, port: 3000 });

  return {
    app: httpApp,
    server: httpServer,
  };
};

export { getHttpHono };
