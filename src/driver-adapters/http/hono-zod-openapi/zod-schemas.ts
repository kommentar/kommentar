import { z } from "@hono/zod-openapi";

const commenterSchema = z
  .object({
    displayName: z.string().openapi({
      description: "Display name of the commenter",
      example: "safwanyp",
    }),
    realName: z.string().optional().openapi({
      description: "Real name of the commenter",
      example: "Safwan Parkar",
    }),
  })
  .openapi("Commenter", {
    description: "Information about the commenter",
  });

const commentSchema = z
  .object({
    id: z.string().openapi({
      description: "Unique identifier of the comment",
      example: "bbba7fe5-40d7-44a6-b183-fcdffa06522f",
    }),
    content: z.string().openapi({
      description: "Content of the comment",
      example: "This is a comment",
    }),
    hostId: z.string().openapi({
      description:
        "Unique identifier of the host, where the comment is placed (e.g. post, video, etc.)",
      example: "33d4f4d8-25b1-463d-9af5-be3da7b2f967",
    }),
    createdAt: z.date().openapi({
      description: "Date when the comment was created",
      example: "2024-11-01T12:00:00.000Z",
    }),
    updatedAt: z.date().openapi({
      description: "Date when the comment was last updated",
      example: "2024-11-01T12:00:00.000Z",
    }),
    commenter: commenterSchema,
  })
  .openapi("Comment");

const consumerSchema = z
  .object({
    id: z.string().openapi({
      description: "Unique identifier of the consumer",
      example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
    }),
    name: z.string().openapi({
      description: "Name of the consumer",
      example: "Safwan Parkar",
    }),
    description: z.string().optional().openapi({
      description: "Description of the consumer",
      example: "A consumer of the comment system",
    }),
    apiKey: z.string().openapi({
      description: "API key for authentication",
      example: "km_1234567890abcdef1234567890abcdef",
    }),
    isActive: z.boolean().openapi({
      description: "Whether the consumer is active",
      example: true,
    }),
    rateLimit: z.number().optional().openapi({
      description: "Custom rate limit per minute for this consumer",
      example: 100,
    }),
  })
  .openapi("Consumer");

const consumerWithCredentialsSchema = z
  .object({
    id: z.string().openapi({
      description: "Unique identifier of the consumer",
      example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
    }),
    name: z.string().openapi({
      description: "Name of the consumer",
      example: "Safwan Parkar",
    }),
    description: z.string().optional().openapi({
      description: "Description of the consumer",
      example: "A consumer of the comment system",
    }),
    apiKey: z.string().openapi({
      description: "API key for authentication",
      example: "km_1234567890abcdef1234567890abcdef",
    }),
    apiSecret: z.string().openapi({
      description: "API secret for authentication (only returned once)",
      example:
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    }),
    allowedHosts: z
      .array(z.string())
      .optional()
      .openapi({
        description: "List of host IDs this consumer can access",
        example: ["host1", "host2"],
      }),
    isActive: z.boolean().openapi({
      description: "Whether the consumer is active",
      example: true,
    }),
    rateLimit: z.number().optional().openapi({
      description: "Custom rate limit per minute for this consumer",
      example: 100,
    }),
  })
  .openapi("ConsumerWithCredentials");

const commentsSchema = z.array(commentSchema).openapi("Comments");

// Common headers for authenticated routes
const authHeaders = z.object({
  "x-api-key": z.string().openapi({
    description: "API Key for authentication",
    example: "km_1234567890abcdef1234567890abcdef",
  }),
  "x-api-secret": z.string().openapi({
    description: "API Secret for authentication",
    example:
      "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
  }),
});

const superAuthHeaders = z.object({
  "x-admin-key": z.string().openapi({
    description: "Admin Key for superuser authentication",
    example: "admin_1234567890abcdef1234567890abcdef",
  }),
  "x-admin-secret": z.string().openapi({
    description: "Admin Secret for superuser authentication",
    example:
      "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
  }),
});

// Error schemas
const authErrorSchema = z.object({
  error: z.string().openapi({
    example: "Invalid API key",
  }),
  message: z.string().openapi({
    example: "The provided API key is not valid",
  }),
});

const forbiddenErrorSchema = z.object({
  error: z.string().openapi({
    example: "Host not allowed",
  }),
  message: z.string().openapi({
    example: "This consumer is not authorized to access this host",
  }),
});

const genericErrorSchema = z.object({
  message: z.string().openapi({
    example: "Internal server error",
  }),
});

const profaneErrorSchema = z.object({
  message: z.string().openapi({
    example: "Comment contains profanity",
  }),
});

const commentNotFoundErrorSchema = z.object({
  message: z.string().openapi({
    example: "Comment not found",
  }),
});

const consumerNotFoundErrorSchema = z.object({
  message: z.string().openapi({
    example: "Consumer not found",
  }),
});

const superCredentialsErrorSchema = z.object({
  error: z.string().openapi({
    example: "Admin credentials required",
  }),
  message: z.string().openapi({
    example: "Both X-Admin-Key and X-Admin-Secret headers are required",
  }),
});

const superAuthNotConfiguredErrorSchema = z.object({
  error: z.string().openapi({
    example: "Admin authentication not configured",
  }),
  message: z.string().openapi({
    example: "Admin authentication is not properly set up",
  }),
});

const GetCommentsByHostIdSchema = {
  pathParams: z
    .object({
      hostId: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "hostId",
            in: "path",
            required: true,
            description: "Unique identifier of the host",
          },
          example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
        }),
    })
    .required(),
  headers: authHeaders,
  response: commentsSchema,
  errors: {
    401: authErrorSchema,
    403: forbiddenErrorSchema,
  },
};

const PostCommentByHostIdSchema = {
  pathParams: z
    .object({
      hostId: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "hostId",
            in: "path",
            required: true,
            description: "Unique identifier of the host",
          },
          example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
        }),
    })
    .required(),
  headers: authHeaders,
  body: z
    .object({
      content: z.string().openapi({
        example: "This is a comment",
      }),
      commenter: z
        .object({
          displayName: z.string().openapi({
            example: "safwanyp",
          }),
          realName: z.string().optional().openapi({
            example: "Safwan Parkar",
          }),
        })
        .openapi({
          example: {
            displayName: "safwanyp",
            realName: "Safwan Parkar",
          },
        }),
    })
    .required(),
  response: commentSchema,
  errors: {
    400: profaneErrorSchema,
    401: authErrorSchema,
    403: forbiddenErrorSchema,
    500: genericErrorSchema,
  },
};

const PutCommentByIdSchema = {
  pathParams: z
    .object({
      hostId: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "hostId",
            in: "path",
            required: true,
            description: "Unique identifier of the host",
          },
          example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
        }),
      id: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the comment",
          },
          example: "bbba7fe5-40d7-44a6-b183-fcdffa06522f",
        }),
    })
    .required(),
  headers: authHeaders,
  body: z
    .object({
      content: z.string().openapi({
        example: "This is a comment",
      }),
    })
    .required(),
  response: commentSchema,
  errors: {
    400: profaneErrorSchema,
    401: authErrorSchema,
    403: forbiddenErrorSchema,
    404: commentNotFoundErrorSchema,
    500: genericErrorSchema,
  },
};

const DeleteCommentByIdSchema = {
  pathParams: z
    .object({
      hostId: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "hostId",
            in: "path",
            required: true,
            description: "Unique identifier of the host",
          },
          example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
        }),
      id: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the comment",
          },
          example: "bbba7fe5-40d7-44a6-b183-fcdffa06522f",
        }),
    })
    .required(),
  headers: authHeaders,
  response: z.object({
    message: z.string().openapi({
      example: "Comment deleted",
    }),
  }),
  errors: {
    401: authErrorSchema,
    403: forbiddenErrorSchema,
    404: commentNotFoundErrorSchema,
    500: genericErrorSchema,
  },
};

const GetConsumerByIdSchema = {
  pathParams: z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the consumer",
          },
          example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
        }),
    })
    .required(),
  headers: superAuthHeaders,
  response: consumerSchema,
  errors: {
    400: genericErrorSchema,
    401: superCredentialsErrorSchema,
    404: consumerNotFoundErrorSchema,
    500: genericErrorSchema,
    503: superAuthNotConfiguredErrorSchema,
  },
};

const PostConsumerSchema = {
  headers: superAuthHeaders,
  body: z
    .object({
      name: z.string().openapi({
        description: "Name of the consumer",
        example: "My Blog Application",
      }),
      description: z.string().optional().openapi({
        description: "Description of the consumer",
        example: "Comment system for my personal blog",
      }),
      allowedHosts: z
        .array(z.string())
        .optional()
        .openapi({
          description: "List of host IDs this consumer can access",
          example: ["host1", "host2"],
        }),
      isActive: z.boolean().optional().openapi({
        description: "Whether the consumer should be active",
        example: true,
      }),
      rateLimit: z.number().optional().openapi({
        description: "Custom rate limit per minute for this consumer",
        example: 100,
      }),
    })
    .required(),
  response: consumerWithCredentialsSchema,
  errors: {
    400: genericErrorSchema,
    401: superCredentialsErrorSchema,
    500: genericErrorSchema,
    503: superAuthNotConfiguredErrorSchema,
  },
};

const DeleteConsumerByIdSchema = {
  headers: superAuthHeaders,
  pathParams: z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the consumer",
          },
          example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
        }),
    })
    .required(),
  response: z.object({
    message: z.string().openapi({
      example: "Consumer deleted",
    }),
  }),
  errors: {
    400: genericErrorSchema,
    401: superCredentialsErrorSchema,
    404: consumerNotFoundErrorSchema,
    500: genericErrorSchema,
    503: superAuthNotConfiguredErrorSchema,
  },
};

const PutConsumerSchema = {
  headers: superAuthHeaders,
  pathParams: z
    .object({
      id: z
        .string()
        .uuid()
        .openapi({
          param: {
            name: "id",
            in: "path",
            required: true,
            description: "Unique identifier of the consumer",
          },
          example: "e3251fe5-9401-4ee0-a15e-9b3a72ef4904",
        }),
    })
    .required(),
  body: z.object({
    name: z.string().openapi({
      description: "Name of the consumer",
      example: "My Blog Application",
    }),
    description: z.string().optional().openapi({
      description: "Description of the consumer",
      example: "Comment system for my personal blog",
    }),
    allowedHosts: z
      .array(z.string())
      .optional()
      .openapi({
        description: "List of host IDs this consumer can access",
        example: ["host1", "host2"],
      }),
    isActive: z.boolean().optional().openapi({
      description: "Whether the consumer should be active",
      example: true,
    }),
    rateLimit: z.number().optional().openapi({
      description: "Custom rate limit per minute for this consumer",
      example: 100,
    }),
  }),
  response: consumerSchema,
  errors: {
    400: genericErrorSchema,
    401: superCredentialsErrorSchema,
    404: consumerNotFoundErrorSchema,
    500: genericErrorSchema,
    503: superAuthNotConfiguredErrorSchema,
  },
};

const GetAllConsumersSchema = {
  headers: superAuthHeaders,
  query: z.object({
    offset: z.number().optional().openapi({
      description: "Offset for pagination",
      example: 0,
    }),
    limit: z.number().optional().openapi({
      description: "Limit for number of consumers to return",
      example: 20,
    }),
  }),
  response: z.array(consumerSchema).openapi("ConsumersList", {
    description: "List of all consumers",
  }),
  errors: {
    400: genericErrorSchema,
    401: superCredentialsErrorSchema,
    500: genericErrorSchema,
    503: superAuthNotConfiguredErrorSchema,
  },
};

export {
  GetCommentsByHostIdSchema,
  PostCommentByHostIdSchema,
  PutCommentByIdSchema,
  DeleteCommentByIdSchema,
  GetConsumerByIdSchema,
  PostConsumerSchema,
  DeleteConsumerByIdSchema,
  PutConsumerSchema,
  GetAllConsumersSchema,
};
