import {
  type CustomError,
  errors,
} from "../../../../app/domain/entities/error.js";
import {
  createConsumerRoute,
  deleteConsumerRoute,
  getAllConsumersRoute,
  getConsumerByIdRoute,
  updateConsumerByIdRoute,
} from "./routes.js";
import type { App } from "../../../../app/domain/entities/app.js";
import type { Consumer } from "../../../../app/domain/entities/consumer.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { SecretStore } from "../../../../app/driven-ports/secret-store.js";
import { adminAuthMiddleware } from "../middlewares.js";
import { createHttpError } from "../helpers.js";

type GetSuperRouter = ({
  app,
  secretStore,
}: {
  app: App;
  secretStore: SecretStore;
}) => OpenAPIHono;

const getSuperRouter: GetSuperRouter = ({ app, secretStore }) => {
  const superRouter = new OpenAPIHono();

  superRouter.use(adminAuthMiddleware(secretStore));

  superRouter.openapi(getConsumerByIdRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");

      const consumer = await app.consumer.getFullConsumerById({ id });

      if (!consumer) {
        throw errors.domain.consumerNotFound;
      }

      return c.json(consumer, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  superRouter.openapi(createConsumerRoute, async (c) => {
    try {
      const { name, description, allowedHosts, rateLimit, isActive } =
        c.req.valid("json");

      const consumer: Consumer = {
        id: "TEMPORARY_ID",
        name: name.trim(),
        description: description ? description.trim() : "",
        allowedHosts: allowedHosts.map((host) => host.trim()),
        rateLimit: rateLimit,
        isActive: isActive ?? true,
        apiKey: "TEMPORARY_API_KEY",
        apiSecret: "TEMPORARY_API_SECRET",
      };

      const createdConsumer = await app.consumer.createConsumer({ consumer });

      return c.json(createdConsumer, 201);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  superRouter.openapi(deleteConsumerRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");

      const consumer = await app.consumer.getConsumerById({ id });
      if (!consumer) {
        throw errors.domain.consumerNotFound;
      }

      const deletedConsumer = await app.consumer.deleteConsumer({ id });

      return c.json(
        {
          message: `Consumer with ID ${deletedConsumer.id} deleted successfully.`,
        },
        200,
      );
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  superRouter.openapi(updateConsumerByIdRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const { name, description, allowedHosts, rateLimit, isActive } =
        c.req.valid("json");

      const existingConsumer = await app.consumer.getFullConsumerById({ id });
      if (!existingConsumer) {
        throw errors.domain.consumerNotFound;
      }

      const consumer: Consumer = {
        ...existingConsumer,
        name: name.trim() ? name.trim() : existingConsumer.name,
      };

      if (description !== undefined) {
        consumer.description = description;
      }

      if (allowedHosts !== undefined) {
        consumer.allowedHosts = allowedHosts.map((host) => host.trim());
      }

      if (rateLimit !== undefined) {
        consumer.rateLimit = rateLimit;
      }

      if (isActive !== undefined) {
        consumer.isActive = isActive;
      }

      const updatedConsumer = await app.consumer.updateConsumer({
        consumer,
      });

      return c.json(updatedConsumer, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  superRouter.openapi(getAllConsumersRoute, async (c) => {
    try {
      const { offset, limit } = c.req.valid("query");

      const consumers = await app.consumer.getAllConsumers({
        offset: offset ?? 0,
        limit: limit ?? 100,
      });

      return c.json(consumers, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  return superRouter;
};

export { getSuperRouter };
