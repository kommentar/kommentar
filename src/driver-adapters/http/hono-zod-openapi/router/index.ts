import type { App } from "../../../../app/domain/entities/app.js";
import type { DataStore } from "../../../../app/driven-ports/data-store.js";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { SecretStore } from "../../../../app/driven-ports/secret-store.js";
import { getApiRouter } from "./api.js";
import { getSuperRouter } from "./super.js";

type GetRouter = ({
  app,
  dataStore,
  secretStore,
}: {
  app: App;
  dataStore: DataStore;
  secretStore: SecretStore;
}) => {
  apiRouter: OpenAPIHono;
  superRouter: OpenAPIHono;
};

const getRouter: GetRouter = ({ app, dataStore, secretStore }) => {
  const apiRouter = getApiRouter({ app, dataStore });
  const superRouter = getSuperRouter({ app, secretStore });

  return { apiRouter, superRouter };
};

export { getRouter };
