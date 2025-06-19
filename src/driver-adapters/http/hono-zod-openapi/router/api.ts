import { OpenAPIHono } from "@hono/zod-openapi";
import {
  consumerAuthMiddleware,
  consumerRateLimitMiddleware,
} from "../middlewares.js";
import type { DataStore } from "../../../../app/driven-ports/data-store.js";
import {
  createCommentForHostRoute,
  deleteCommentByIdRoute,
  getCommentsForHostRoute,
  getConsumerByIdRoute,
  updateCommentByIdRoute,
} from "../routes.js";
import type { App } from "../../../../app/domain/entities/app.js";
import { createHttpError } from "../helpers.js";
import {
  errors,
  type CustomError,
} from "../../../../app/domain/entities/error.js";
import { getCookie } from "hono/cookie";

type GetApiRouter = ({
  app,
  dataStore,
}: {
  app: App;
  dataStore: DataStore;
}) => OpenAPIHono;

const getApiRouter: GetApiRouter = ({ app, dataStore }) => {
  const apiRouter = new OpenAPIHono();

  apiRouter.use(consumerAuthMiddleware(dataStore));
  apiRouter.use(consumerRateLimitMiddleware());

  apiRouter.openapi(getCommentsForHostRoute, async (c) => {
    try {
      const { hostId } = c.req.valid("param");

      const comments = await app.getCommentsForHost({ hostId });

      return c.json(comments, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  apiRouter.openapi(createCommentForHostRoute, async (c) => {
    try {
      const { hostId } = c.req.valid("param");
      const { content, commenter } = c.req.valid("json");
      const sessionId = getCookie(c, "sessionId") as string;

      const comment = await app.createCommentForHost({
        hostId,
        content,
        sessionId,
        commenter,
      });

      return c.json(comment, 201);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  apiRouter.openapi(updateCommentByIdRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const { content } = c.req.valid("json");
      const sessionId = getCookie(c, "sessionId") as string;

      const comment = await app.updateCommentById({ id, content, sessionId });

      return c.json(comment, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  apiRouter.openapi(deleteCommentByIdRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const sessionId = getCookie(c, "sessionId") as string;

      await app.deleteCommentById({ id, sessionId });

      return c.json({ message: "Comment deleted" }, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  // Consumer info route (read-only for self-inspection)
  apiRouter.openapi(getConsumerByIdRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");

      const consumer = await app.getConsumerById({ id });

      if (!consumer) {
        throw errors.domain.consumerNotFound;
      }

      return c.json(consumer, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  return apiRouter;
};

export { getApiRouter };
