import { serve, type ServerType } from "@hono/node-server";
import type { Hono } from "hono";

type GetHonoServer = ({ app, port }: { app: Hono; port: number }) => ServerType;

const getHonoServer: GetHonoServer = ({ app, port }) => {
  const server = serve({
    fetch: app.fetch,
    port,
  });

  console.log(`Server running at http://localhost:${port}`);

  return server;
};

export { getHonoServer };
