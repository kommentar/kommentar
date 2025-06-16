import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type {
  CustomError,
  ErrorCode,
} from "../../../app/domain/entities/error.js";

type CreateHttpError = (error: CustomError) => HTTPException;

const errorStatusMap: Record<ErrorCode, ContentfulStatusCode> = {
  InvalidInput: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  UnknownError: 500,
  RateLimitExceeded: 429,
  Unavailable: 503,
};

const createHttpError: CreateHttpError = ({
  message,
  type,
  code,
  retryable,
}) => {
  const httpStatusCode = errorStatusMap[code] || 500;
  console.log(
    `Creating HTTP error: ${message}, Type: ${type}, Code: ${code}, Status: ${httpStatusCode}`,
  );

  const error = new HTTPException(httpStatusCode, {
    message,
    res: new Response(JSON.stringify({ message, type }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: httpStatusCode,
    }),
  });

  if (retryable) {
    error.res?.headers.append("Retry-After", "10");
  }

  return error;
};

export { createHttpError };
