import type { Hono } from "hono";
import { getHttpAppHono } from "./app.js";
import { getHonoServer } from "./server.js";
import type { ServerType } from "@hono/node-server";

type GetHttpHono = () => { app: Hono; server: ServerType };

const getHttpHono: GetHttpHono = () => {
  const app = getHttpAppHono();
  const server = getHonoServer({ app, port: 3000 });

  return {
    app,
    server,
  };
};

export { getHttpHono };
