import { serve, type ServerType } from "@hono/node-server";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { CustomHonoEnv } from "./app.js";

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
