import type { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { getCookie, setCookie } from "hono/cookie";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";
import type { DataStore } from "../../../app/driven-ports/data-store.js";

type SessionMiddleware = (randomId: RandomId) => MiddlewareHandler;
type ConsumerAuthMiddleware = (dataStore: DataStore) => MiddlewareHandler;

const sessionMiddleware: SessionMiddleware = (randomId) =>
  createMiddleware(async (c, next) => {
    const sessionId = getCookie(c, "sessionId");

    if (!sessionId) {
      const newSessionId = randomId.generate();

      setCookie(c, "sessionId", newSessionId, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });
    }

    await next();
  });

const rateLimitMiddleware = rateLimiter({
  windowMs: 60 * 1000,
  limit: 25,
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    const sessionId = getCookie(c, "sessionId") as string;
    const connInfo = getConnInfo(c);
    return `${sessionId}:${connInfo.remote.address}`;
  },
});

const consumerAuthMiddleware: ConsumerAuthMiddleware = (dataStore) =>
  createMiddleware(async (c, next) => {
    const consumerId = c.req.header("X-Consumer-ID");

    if (!consumerId) {
      return c.json({ error: "Consumer ID is required" }, 400);
    }

    const consumer = await dataStore.consumer.getById({ consumerId });

    if (!consumer) {
      return c.json({ error: "Consumer not found" }, 404);
    }

    await next();
  });

export { sessionMiddleware, rateLimitMiddleware, consumerAuthMiddleware };
