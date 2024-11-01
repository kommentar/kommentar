import { z } from "@hono/zod-openapi";

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
  })
  .openapi("Comment");

const commentsSchema = z.array(commentSchema).openapi("Comments");

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
  response: commentsSchema,
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
  body: z
    .object({
      content: z.string().openapi({
        example: "This is a comment",
      }),
    })
    .required(),
  response: commentSchema,
};

const PutCommentByIdSchema = {
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
            description: "Unique identifier of the comment",
          },
          example: "bbba7fe5-40d7-44a6-b183-fcdffa06522f",
        }),
    })
    .required(),
  body: z
    .object({
      content: z.string().openapi({
        example: "This is a comment",
      }),
    })
    .required(),
  response: commentSchema,
};

const DeleteCommentByIdSchema = {
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
            description: "Unique identifier of the comment",
          },
          example: "bbba7fe5-40d7-44a6-b183-fcdffa06522f",
        }),
    })
    .required(),
  response: z.object({
    message: z.string().openapi({
      example: "Comment deleted",
    }),
  }),
};

export {
  GetCommentsByHostIdSchema,
  PostCommentByHostIdSchema,
  PutCommentByIdSchema,
  DeleteCommentByIdSchema,
};
