import type { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { getCookie, setCookie } from "hono/cookie";

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

export { sessionMiddleware };
