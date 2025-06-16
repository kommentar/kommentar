import { OpenAPIHono } from "@hono/zod-openapi";
import type { App } from "../../../app/domain/entities/app.js";
import {
  createCommentForHostRoute,
  deleteCommentByIdRoute,
  getCommentsForHostRoute,
  getConsumerByIdRoute,
  updateCommentByIdRoute,
} from "./routes.js";
import { Scalar } from "@scalar/hono-api-reference";
import { HTTPException } from "hono/http-exception";
import { getCookie } from "hono/cookie";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import {
  consumerAuthMiddleware,
  consumerRateLimitMiddleware,
  rateLimitMiddleware,
  sessionMiddleware,
} from "./middlewares.js";
import type { DataStore } from "../../../app/driven-ports/data-store.js";
import { createHttpError } from "./helpers.js";
import {
  errors,
  type CustomError,
} from "../../../app/domain/entities/error.js";

type GetHttpAppHonoZodOpenApi = ({
  app,
  randomId,
  dataStore,
}: {
  app: App;
  randomId: RandomId;
  dataStore: DataStore;
}) => OpenAPIHono;

const apiClientservers = [
  {
    url: "http://localhost:3000",
    description: "Local development server",
  },
];

const getHttpAppHonoZodOpenApi: GetHttpAppHonoZodOpenApi = ({
  app,
  randomId,
  dataStore,
}) => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.PRODUCTION_API_SERVER_URL
  ) {
    apiClientservers.push({
      url: String(process.env.PRODUCTION_API_SERVER_URL),
      description: "Production server",
    });
  }

  const hono = new OpenAPIHono();

  hono.use(sessionMiddleware(randomId));
  hono.use(rateLimitMiddleware);

  hono.use("/hosts/*", consumerAuthMiddleware(dataStore));
  hono.use("/hosts/*", consumerRateLimitMiddleware());

  hono.use("/consumers/*", consumerAuthMiddleware(dataStore));

  // Comment routes
  hono.openapi(getCommentsForHostRoute, async (c) => {
    try {
      const { hostId } = c.req.valid("param");

      const comments = await app.getCommentsForHost({ hostId });

      return c.json(comments, 200);
    } catch (err) {
      throw createHttpError(err as unknown as CustomError);
    }
  });

  hono.openapi(createCommentForHostRoute, async (c) => {
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

  hono.openapi(updateCommentByIdRoute, async (c) => {
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

  hono.openapi(deleteCommentByIdRoute, async (c) => {
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
  hono.openapi(getConsumerByIdRoute, async (c) => {
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

  // Documentation
  hono.doc("/spec", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Kommentar | OpenAPI Specification",
    },
  });

  hono.get(
    "/reference",
    Scalar({
      pageTitle: "Kommentar | API Reference",
      servers: apiClientservers,
      url: "/spec",
      defaultOpenAllTags: true,
    }),
  );

  hono.onError((err, c) => {
    if (err instanceof HTTPException) {
      console.log("HTTP Exception:", err);
      return err.getResponse();
    }

    console.error("Unhandled error:", err);
    return c.json({ message: "Internal server error" }, 500);
  });

  return hono;
};

export { getHttpAppHonoZodOpenApi };
