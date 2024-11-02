import { HTTPException } from "hono/http-exception";
import type { CustomError } from "../../entities/error.js";
import type { StatusCode } from "hono/utils/http-status";

type CreateError = (error: CustomError) => HTTPException;

const createError: CreateError = ({ message, code, status }) => {
  const error = new HTTPException(status as StatusCode, {
    message,
    res: new Response(JSON.stringify({ message, code }), {
      headers: {
        "Content-Type": "application/json",
      },
      status,
    }),
  });

  return error;
};

export { createError };
