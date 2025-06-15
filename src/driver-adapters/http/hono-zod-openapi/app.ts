import { OpenAPIHono } from "@hono/zod-openapi";
import type { App } from "../../../app/domain/entities/app.js";
import {
  createCommentForHostRoute,
  deleteCommentByIdRoute,
  getCommentsForHostRoute,
  getConsumerByIdRoute,
  updateCommentByIdRoute,
} from "./routes.js";
import { apiReference } from "@scalar/hono-api-reference";
import { HTTPException } from "hono/http-exception";
import { getCookie } from "hono/cookie";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { rateLimitMiddleware, sessionMiddleware } from "./middlewares.js";

type GetHttpAppHonoZodOpenApi = ({
  app,
  randomId,
}: {
  app: App;
  randomId: RandomId;
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

  hono.openapi(getCommentsForHostRoute, async (c) => {
    const { hostId } = c.req.valid("param");

    const comments = await app.getCommentsForHost({ hostId });

    return c.json(comments, 200);
  });

  hono.openapi(createCommentForHostRoute, async (c) => {
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
  });

  hono.openapi(updateCommentByIdRoute, async (c) => {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("json");
    const sessionId = getCookie(c, "sessionId") as string;

    const comment = await app.updateCommentById({ id, content, sessionId });

    return c.json(comment, 200);
  });

  hono.openapi(deleteCommentByIdRoute, async (c) => {
    const { id } = c.req.valid("param");
    const sessionId = getCookie(c, "sessionId") as string;

    await app.deleteCommentById({ id, sessionId });

    return c.json({ message: "Comment deleted" }, 200);
  });

  hono.openapi(getConsumerByIdRoute, async (c) => {
    const { id } = c.req.valid("param");

    const consumer = await app.getConsumerById({ id });

    if (!consumer) {
      return c.json({ message: "Consumer not found" }, 404);
    }

    return c.json(consumer, 200);
  });

  hono.doc("/spec", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Kommentar | OpenAPI Specification",
    },
  });

  hono.get(
    "/reference",
    apiReference({
      pageTitle: "Kommentar | API Reference",
      servers: apiClientservers,
      spec: {
        url: "/spec",
      },
    }),
  );

  hono.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    return c.json({ message: "Internal server error" }, 500);
  });

  return hono;
};

export { getHttpAppHonoZodOpenApi };
