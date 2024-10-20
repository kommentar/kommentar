import { Hono } from "hono";

type GetHttpAppHono = () => Hono;

const getHttpAppHono: GetHttpAppHono = () => {
  const app = new Hono();

  app.get("/", async (c) => {
    return c.json({ message: "Hello, World!" });
  });

  return app;
};

export { getHttpAppHono };
