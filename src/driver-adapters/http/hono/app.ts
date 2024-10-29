import { Hono } from "hono";
import type { App } from "../../../app/domain/entities/app.js";

type GetHttpAppHono = ({ app }: { app: App }) => Hono;

const getHttpAppHono: GetHttpAppHono = ({ app }) => {
  const hono = new Hono();

  hono.get("/", async (c) => {
    return c.json({ message: "Hello, World!" });
  });

  hono.get("/comments/:hostId", async (c) => {
    const hostId = c.req.param("hostId");
    const comments = await app.getCommentsForHost({ hostId });
    return c.json(comments);
  });

  hono.post("/comments/:hostId", async (c) => {
    const hostId = c.req.param("hostId");
    const body = await c.req.json();
    const content = body.content;
    const comment = await app.createCommentForHost({ hostId, content });
    return c.json(comment);
  });

  hono.put("/comments/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const content = body.content;
    const comment = await app.updateCommentById({ id, content });
    return c.json(comment);
  });

  hono.delete("/comments/:id", async (c) => {
    const id = c.req.param("id");
    await app.deleteCommentById({ id });
    return c.json({ message: "Comment deleted" });
  });

  return hono;
};

export { getHttpAppHono };
