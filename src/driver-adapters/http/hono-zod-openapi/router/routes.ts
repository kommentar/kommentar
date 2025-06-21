import {
  DeleteCommentByIdSchema,
  DeleteConsumerByIdSchema,
  GetAllConsumersSchema,
  GetCommentsByHostIdSchema,
  GetConsumerByIdSchema,
  PostCommentByHostIdSchema,
  PostConsumerSchema,
  PutCommentByIdSchema,
  PutConsumerSchema,
} from "../zod-schemas.js";
import { createRoute } from "@hono/zod-openapi";

const getCommentsForHostRoute = createRoute({
  tags: ["Comments"],
  summary: "Get comments for a host",
  description:
    "Retrieve all comments for a specific host. Requires API key and secret authentication.",
  method: "get",
  path: "/hosts/{hostId}/comments",
  request: {
    params: GetCommentsByHostIdSchema.pathParams,
    headers: GetCommentsByHostIdSchema.headers,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: GetCommentsByHostIdSchema.response },
      },
      description: "Get comments for a host",
    },
    401: {
      content: {
        "application/json": { schema: GetCommentsByHostIdSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    403: {
      content: {
        "application/json": { schema: GetCommentsByHostIdSchema.errors[403] },
      },
      description: "Forbidden - Consumer not allowed to access this host",
    },
  },
});

const createCommentForHostRoute = createRoute({
  tags: ["Comments"],
  summary: "Create a comment for a host",
  description:
    "Create a new comment for a specific host. Requires API key and secret authentication.",
  method: "post",
  path: "/hosts/{hostId}/comments",
  request: {
    params: PostCommentByHostIdSchema.pathParams,
    headers: PostCommentByHostIdSchema.headers,
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
    400: {
      content: {
        "application/json": { schema: PostCommentByHostIdSchema.errors[400] },
      },
      description: "Bad request - Invalid input or profanity detected",
    },
    401: {
      content: {
        "application/json": { schema: PostCommentByHostIdSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    403: {
      content: {
        "application/json": { schema: PostCommentByHostIdSchema.errors[403] },
      },
      description: "Forbidden - Consumer not allowed to access this host",
    },
    500: {
      content: {
        "application/json": { schema: PostCommentByHostIdSchema.errors[500] },
      },
      description: "Internal server error",
    },
  },
});

const updateCommentByIdRoute = createRoute({
  tags: ["Comments"],
  summary: "Update a comment by id",
  description:
    "Update an existing comment. Requires API key and secret authentication.",
  method: "put",
  path: "/hosts/{hostId}/comments/{id}",
  request: {
    params: PutCommentByIdSchema.pathParams,
    headers: PutCommentByIdSchema.headers,
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
    400: {
      content: {
        "application/json": { schema: PutCommentByIdSchema.errors[400] },
      },
      description: "Bad request - Invalid input or profanity detected",
    },
    401: {
      content: {
        "application/json": { schema: PutCommentByIdSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    403: {
      content: {
        "application/json": { schema: PutCommentByIdSchema.errors[403] },
      },
      description: "Forbidden - Consumer not allowed to access this host",
    },
    404: {
      content: {
        "application/json": { schema: PutCommentByIdSchema.errors[404] },
      },
      description: "Not found",
    },
    500: {
      content: {
        "application/json": { schema: PutCommentByIdSchema.errors[500] },
      },
      description: "Internal server error",
    },
  },
});

const deleteCommentByIdRoute = createRoute({
  tags: ["Comments"],
  summary: "Delete a comment by id",
  description:
    "Delete an existing comment. Requires API key and secret authentication.",
  method: "delete",
  path: "/hosts/{hostId}/comments/{id}",
  request: {
    params: DeleteCommentByIdSchema.pathParams,
    headers: DeleteCommentByIdSchema.headers,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: DeleteCommentByIdSchema.response },
      },
      description: "Delete a comment by id",
    },
    401: {
      content: {
        "application/json": { schema: DeleteCommentByIdSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    403: {
      content: {
        "application/json": { schema: DeleteCommentByIdSchema.errors[403] },
      },
      description: "Forbidden - Consumer not allowed to access this host",
    },
    404: {
      content: {
        "application/json": { schema: DeleteCommentByIdSchema.errors[404] },
      },
      description: "Not found",
    },
    500: {
      content: {
        "application/json": { schema: DeleteCommentByIdSchema.errors[500] },
      },
      description: "Internal server error",
    },
  },
});

const getConsumerByIdRoute = createRoute({
  tags: ["Super"],
  summary: "Get a consumer",
  description:
    "Retrieve consumer information by ID. Requires API key and secret authentication.",
  method: "get",
  path: "/consumer/{id}",
  request: {
    params: GetConsumerByIdSchema.pathParams,
    headers: GetConsumerByIdSchema.headers,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: GetConsumerByIdSchema.response },
      },
      description: "Get a consumer by id",
    },
    400: {
      content: {
        "application/json": { schema: GetConsumerByIdSchema.errors[400] },
      },
      description: "Bad request - Invalid input",
    },
    401: {
      content: {
        "application/json": { schema: GetConsumerByIdSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    404: {
      content: {
        "application/json": { schema: GetConsumerByIdSchema.errors[404] },
      },
      description: "Consumer Not found",
    },
    500: {
      content: {
        "application/json": { schema: GetConsumerByIdSchema.errors[500] },
      },
      description: "Internal server error",
    },
    503: {
      content: {
        "application/json": { schema: GetConsumerByIdSchema.errors[503] },
      },
      description:
        "Service Unavailable - Admin authentication is not properly set up",
    },
  },
});

const createConsumerRoute = createRoute({
  tags: ["Super"],
  summary: "Create a new consumer",
  description:
    "Create a new API consumer with generated credentials. Requires superuser authentication.",
  method: "post",
  path: "/consumer",
  request: {
    headers: PostConsumerSchema.headers,
    body: {
      content: {
        "application/json": {
          schema: PostConsumerSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": { schema: PostConsumerSchema.response },
      },
      description: "Consumer created successfully",
    },
    400: {
      content: {
        "application/json": { schema: PostConsumerSchema.errors[400] },
      },
      description: "Bad request - Invalid input",
    },
    401: {
      content: {
        "application/json": { schema: PostConsumerSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    500: {
      content: {
        "application/json": { schema: PostConsumerSchema.errors[500] },
      },
      description: "Internal server error",
    },
    503: {
      content: {
        "application/json": { schema: PostConsumerSchema.errors[503] },
      },
      description:
        "Service Unavailable - Admin authentication is not properly set up",
    },
  },
});

const deleteConsumerRoute = createRoute({
  tags: ["Super"],
  summary: "Delete a consumer",
  description:
    "Delete an existing API consumer by ID. Requires superuser authentication.",
  method: "delete",
  path: "/consumer/{id}",
  request: {
    headers: DeleteConsumerByIdSchema.headers,
    params: DeleteConsumerByIdSchema.pathParams,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: DeleteConsumerByIdSchema.response },
      },
      description: "Consumer deleted successfully",
    },
    400: {
      content: {
        "application/json": { schema: DeleteConsumerByIdSchema.errors[400] },
      },
      description: "Bad request - Invalid input",
    },
    401: {
      content: {
        "application/json": { schema: DeleteConsumerByIdSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    404: {
      content: {
        "application/json": { schema: DeleteConsumerByIdSchema.errors[404] },
      },
      description: "Not found",
    },
    500: {
      content: {
        "application/json": { schema: DeleteConsumerByIdSchema.errors[500] },
      },
      description: "Internal server error",
    },
    503: {
      content: {
        "application/json": { schema: DeleteConsumerByIdSchema.errors[503] },
      },
      description:
        "Service Unavailable - Admin authentication is not properly set up",
    },
  },
});

const updateConsumerByIdRoute = createRoute({
  tags: ["Super"],
  summary: "Update a consumer",
  description:
    "Update an existing API consumer's information. Requires superuser authentication.",
  method: "put",
  path: "/consumer/{id}",
  request: {
    params: PutConsumerSchema.pathParams,
    headers: PutConsumerSchema.headers,
    body: {
      content: {
        "application/json": {
          schema: PutConsumerSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: PutConsumerSchema.response },
      },
      description: "Consumer updated successfully",
    },
    400: {
      content: {
        "application/json": { schema: PutConsumerSchema.errors[400] },
      },
      description: "Bad request - Invalid input",
    },
    401: {
      content: {
        "application/json": { schema: PutConsumerSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    404: {
      content: {
        "application/json": { schema: PutConsumerSchema.errors[404] },
      },
      description: "Not found",
    },
    500: {
      content: {
        "application/json": { schema: PutConsumerSchema.errors[500] },
      },
      description: "Internal server error",
    },
    503: {
      content: {
        "application/json": { schema: PutConsumerSchema.errors[503] },
      },
      description:
        "Service Unavailable - Admin authentication is not properly set up",
    },
  },
});

const getAllConsumersRoute = createRoute({
  tags: ["Super"],
  summary: "Get all consumers",
  description:
    "Retrieve a list of all API consumers. Requires superuser authentication.",
  method: "get",
  path: "/consumers",
  request: {
    headers: GetAllConsumersSchema.headers,
    query: GetAllConsumersSchema.query,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: GetAllConsumersSchema.response },
      },
      description: "List of all consumers",
    },
    400: {
      content: {
        "application/json": { schema: GetAllConsumersSchema.errors[400] },
      },
      description: "Bad request - Invalid input",
    },
    401: {
      content: {
        "application/json": { schema: GetAllConsumersSchema.errors[401] },
      },
      description: "Unauthorized - Invalid or missing API credentials",
    },
    500: {
      content: {
        "application/json": { schema: GetAllConsumersSchema.errors[500] },
      },
      description: "Internal server error",
    },
    503: {
      content: {
        "application/json": { schema: GetAllConsumersSchema.errors[503] },
      },
      description:
        "Service Unavailable - Admin authentication is not properly set up",
    },
  },
});

export {
  getCommentsForHostRoute,
  createCommentForHostRoute,
  updateCommentByIdRoute,
  deleteCommentByIdRoute,
  getConsumerByIdRoute,
  createConsumerRoute,
  deleteConsumerRoute,
  updateConsumerByIdRoute,
  getAllConsumersRoute,
};
