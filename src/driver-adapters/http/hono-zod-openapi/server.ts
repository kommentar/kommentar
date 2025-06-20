import { type ServerType, serve } from "@hono/node-server";
import type { CustomHonoEnv } from "./app.js";
import type { OpenAPIHono } from "@hono/zod-openapi";

type GetHonoZodOpenApiServer = ({
  app,
  port,
}: {
  app: OpenAPIHono<CustomHonoEnv>;
  port: number;
}) => ServerType;

const getHonoZodOpenApiServer: GetHonoZodOpenApiServer = ({ app, port }) => {
  const server = serve({
    fetch: app.fetch,
    port,
  });

  console.log(`Server running at http://localhost:${port}`);

  return server;
};

export { getHonoZodOpenApiServer };
