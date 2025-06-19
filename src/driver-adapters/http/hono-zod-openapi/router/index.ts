import type { OpenAPIHono } from "@hono/zod-openapi";
import type { App } from "../../../../app/domain/entities/app.js";
import type { DataStore } from "../../../../app/driven-ports/data-store.js";
import { getApiRouter } from "./api.js";

type GetRouter = ({ app, dataStore }: { app: App; dataStore: DataStore }) => {
  apiRouter: OpenAPIHono;
};

const getRouter: GetRouter = ({ app, dataStore }) => {
  const apiRouter = getApiRouter({ app, dataStore });

  return { apiRouter };
};

export { getRouter };
