import type { QueryConfig } from "pg";
import type { Comment } from "../../../app/domain/entities/comment.js";

type GetCreateTableCommentsQuery = () => QueryConfig;
type GetAllCommentsByHostIdQuery = ({
  hostId,
}: {
  hostId: Comment["hostId"];
}) => QueryConfig;
type SaveCommentByHostIdQuery = ({
  id,
  hostId,
  content,
}: {
  id: Comment["id"];
  hostId: Comment["hostId"];
  content: Comment["content"];
}) => QueryConfig;
type UpdateCommentByIdQuery = ({
  id,
  content,
}: {
  id: Comment["id"];
  content: Comment["content"];
}) => QueryConfig;
type DeleteCommentByIdQuery = ({ id }: { id: Comment["id"] }) => QueryConfig;

const getCreateTableCommentsQuery: GetCreateTableCommentsQuery = () => {
  return {
    name: "create-table-comments",
    text: `
        CREATE TABLE IF NOT EXISTS comments (
            id uuid PRIMARY KEY,
            content text NOT NULL,
            hostId varchar(255) NOT NULL,
            createdAt timestamp NOT NULL,
            updatedAt timestamp NOT NULL
        );
        `,
  };
};

const getAllCommentsByHostIdQuery: GetAllCommentsByHostIdQuery = ({
  hostId,
}) => {
  return {
    name: "get-all-comments-by-host-id",
    text: `
        SELECT * FROM comments WHERE hostId = $1;
        `,
    values: [hostId],
  };
};

const saveCommentByHostIdQuery: SaveCommentByHostIdQuery = ({
  id,
  hostId,
  content,
}) => {
  return {
    name: "save-comment-by-host-id",
    text: `
        INSERT INTO comments (id, content, hostId, createdAt, updatedAt)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *;
        `,
    values: [id, content, hostId],
  };
};

const updateCommentByIdQuery: UpdateCommentByIdQuery = ({ id, content }) => {
  return {
    name: "update-comment-by-id",
    text: `
        UPDATE comments
        SET content = $1, updatedAt = NOW()
        WHERE id = $2
        RETURNING *;
        `,
    values: [content, id],
  };
};

const deleteCommentByIdQuery: DeleteCommentByIdQuery = ({ id }) => {
  return {
    name: "delete-comment-by-id",
    text: `
        DELETE FROM comments
        WHERE id = $1;
        `,
    values: [id],
  };
};

export {
  getCreateTableCommentsQuery,
  getAllCommentsByHostIdQuery,
  saveCommentByHostIdQuery,
  updateCommentByIdQuery,
  deleteCommentByIdQuery,
};
