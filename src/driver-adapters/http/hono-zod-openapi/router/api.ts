import {
  consumerAuthMiddleware,
  consumerRateLimitMiddleware,
} from "../middlewares.js";
import {
  createCommentForHostRoute,
  deleteCommentByIdRoute,
  getCommentsForHostRoute,
  updateCommentByIdRoute,
} from "./routes.js";
import type { App } from "../../../../app/domain/entities/app.js";
import type { Comment } from "../../../../app/domain/entities/comment.js";
import { type CustomError } from "../../../../app/domain/entities/error.js";
import type { DataStore } from "../../../../app/driven-ports/data-store.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createHttpError } from "../helpers.js";
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
  apiRouter.use(consumerRateLimitMiddleware);

  apiRouter.openapi(getCommentsForHostRoute, async (c) => {
    try {
      const { hostId } = c.req.valid("param");

      const comments = await app.comment.getCommentsForHost({ hostId });

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

      const normalizedCommenter: Comment["commenter"] = {
        displayName: commenter.displayName.trim(),
        realName: commenter.realName ? commenter.realName.trim() : "",
      };

      const comment = await app.comment.createCommentForHost({
        hostId,
        content,
        sessionId,
        commenter: normalizedCommenter,
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

      const comment = await app.comment.updateCommentById({
        id,
        content,
        sessionId,
      });

      return c.json(comment, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  apiRouter.openapi(deleteCommentByIdRoute, async (c) => {
    try {
      const { id } = c.req.valid("param");
      const sessionId = getCookie(c, "sessionId") as string;

      await app.comment.deleteCommentById({ id, sessionId });

      return c.json({ message: "Comment deleted" }, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  return apiRouter;
};

export { getApiRouter };
