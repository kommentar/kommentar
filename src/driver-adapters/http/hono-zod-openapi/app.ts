import { OpenAPIHono } from "@hono/zod-openapi";
import type { App } from "../../../app/domain/entities/app.js";
import {
  createCommentForHostRoute,
  deleteCommentByIdRoute,
  getCommentsForHostRoute,
  updateCommentByIdRoute,
} from "./routes.js";
import { apiReference } from "@scalar/hono-api-reference";

type GetHttpAppHonoZodOpenApi = ({ app }: { app: App }) => OpenAPIHono;

const getHttpAppHonoZodOpenApi: GetHttpAppHonoZodOpenApi = ({ app }) => {
  const hono = new OpenAPIHono();

  hono.openapi(getCommentsForHostRoute, async (c) => {
    const { hostId } = c.req.valid("param");

    const comments = await app.getCommentsForHost({ hostId });

    return c.json(comments, 200);
  });

  hono.openapi(createCommentForHostRoute, async (c) => {
    const { hostId } = c.req.valid("param");
    const { content } = c.req.valid("json");

    const comment = await app.createCommentForHost({ hostId, content });

    return c.json(comment, 201);
  });

  hono.openapi(updateCommentByIdRoute, async (c) => {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("json");

    const comment = await app.updateCommentById({ id, content });

    return c.json(comment, 200);
  });

  hono.openapi(deleteCommentByIdRoute, async (c) => {
    const { id } = c.req.valid("param");

    await app.deleteCommentById({ id });

    return c.json({ message: "Comment deleted" }, 204);
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
      spec: {
        url: "/spec",
      },
    }),
  );

  return hono;
};

export { getHttpAppHonoZodOpenApi };
