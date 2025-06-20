import type { Context, MiddlewareHandler } from "hono";
import type {
  DataStore,
  StoredConsumer,
} from "../../../app/driven-ports/data-store.js";
import { getCookie, setCookie } from "hono/cookie";
import type { CustomHonoEnv } from "./app.js";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { createMiddleware } from "hono/factory";
import { getConnInfo } from "@hono/node-server/conninfo";
import { rateLimiter } from "hono-rate-limiter";
import { verifyApiSecret } from "../../../app/domain/helpers/security/api-key-generator.js";

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
        secure: process.env.NODE_ENV === "production",
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
    const apiKey = c.req.header("X-API-Key");
    const apiSecret = c.req.header("X-API-Secret");

    if (!apiKey || !apiSecret) {
      return c.json(
        {
          error: "API credentials required",
          message: "Both X-API-Key and X-API-Secret headers are required",
        },
        401,
      );
    }

    try {
      const consumer = await dataStore.consumer.getByApiKey({ apiKey });

      if (!consumer) {
        return c.json(
          {
            error: "Invalid API key",
            message: "The provided API key is not valid",
          },
          401,
        );
      }

      if (!consumer.is_active) {
        return c.json(
          {
            error: "Consumer inactive",
            message: "This API consumer has been deactivated",
          },
          403,
        );
      }

      // Verify API secret
      if (!verifyApiSecret(apiSecret, consumer.api_secret)) {
        return c.json(
          {
            error: "Invalid API secret",
            message: "The provided API secret is not valid",
          },
          401,
        );
      }

      // Check host restrictions if configured
      if (consumer.allowed_hosts) {
        const allowedHosts = JSON.parse(consumer.allowed_hosts) as string[];
        const requestPath = c.req.path;

        // Extract hostId from the new URL structure: /api/hosts/{hostId}/...
        const hostIdMatch = requestPath.match(/^\/api\/hosts\/([^/]+)/);

        if (hostIdMatch && allowedHosts.length > 0) {
          const requestedHostId = hostIdMatch[1];
          if (!allowedHosts.includes(requestedHostId)) {
            return c.json(
              {
                error: "Host not allowed",
                message: "This consumer is not authorized to access this host",
              },
              403,
            );
          }
        }
      }

      // Store consumer info in context for rate limiting
      c.set("consumer", consumer);
      await next();
    } catch (error) {
      console.error("Consumer authentication error:", error);
      return c.json(
        {
          error: "Authentication error",
          message: "An error occurred during authentication",
        },
        500,
      );
    }
  });

const consumerRateLimitMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: (c: Context<CustomHonoEnv>) => {
    const consumer = c.get("consumer") as StoredConsumer | undefined;
    if (consumer) {
      return consumer.rate_limit === 0 ? 1000 : Number(consumer.rate_limit);
    }

    // Default rate limit if not set
    return 100;
  },
  standardHeaders: "draft-6",
  keyGenerator: (c: Context<CustomHonoEnv>) => {
    const consumer = c.get("consumer") as StoredConsumer | undefined;
    return consumer ? `consumer:${consumer.id}` : "anonymous";
  },
});

export {
  sessionMiddleware,
  rateLimitMiddleware,
  consumerAuthMiddleware,
  consumerRateLimitMiddleware,
};
