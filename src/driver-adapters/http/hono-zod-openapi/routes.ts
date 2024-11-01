import { createRoute } from "@hono/zod-openapi";
import {
  DeleteCommentByIdSchema,
  GetCommentsByHostIdSchema,
  PostCommentByHostIdSchema,
  PutCommentByIdSchema,
} from "./zod-schemas.js";

const getCommentsForHostRoute = createRoute({
  summary: "Get comments for a host",
  method: "get",
  path: "/comments/{hostId}",
  request: {
    params: GetCommentsByHostIdSchema.pathParams,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: GetCommentsByHostIdSchema.response },
      },
      description: "Get comments for a host",
    },
  },
});

const createCommentForHostRoute = createRoute({
  summary: "Create a comment for a host",
  method: "post",
  path: "/comments/{hostId}",
  request: {
    params: PostCommentByHostIdSchema.pathParams,
    body: {
      content: {
        "application/json": {
          schema: PostCommentByHostIdSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": { schema: PostCommentByHostIdSchema.response },
      },
      description: "Create a comment for a host",
    },
  },
});

const updateCommentByIdRoute = createRoute({
  summary: "Update a comment by id",
  method: "put",
  path: "/comments/{id}",
  request: {
    params: PutCommentByIdSchema.pathParams,
    body: {
      content: {
        "application/json": {
          schema: PutCommentByIdSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: PutCommentByIdSchema.response },
      },
      description: "Update a comment by id",
    },
  },
});

const deleteCommentByIdRoute = createRoute({
  summary: "Delete a comment by id",
  method: "delete",
  path: "/comments/{id}",
  request: {
    params: DeleteCommentByIdSchema.pathParams,
  },
  responses: {
    204: {
      content: {
        "application/json": { schema: DeleteCommentByIdSchema.response },
      },
      description: "Delete a comment by id",
    },
  },
});

export {
  getCommentsForHostRoute,
  createCommentForHostRoute,
  updateCommentByIdRoute,
  deleteCommentByIdRoute,
};
