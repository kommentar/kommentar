import type { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { getCookie, setCookie } from "hono/cookie";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";

type SessionMiddleware = (randomId: RandomId) => MiddlewareHandler;

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

export { sessionMiddleware, rateLimitMiddleware };
