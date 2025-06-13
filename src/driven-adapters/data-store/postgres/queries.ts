import type {
  DeleteCommentByIdQuery,
  GetAllCommentsByHostIdQuery,
  GetCommentByIdQuery,
  SaveCommentByHostIdQuery,
  UpdateCommentByIdQuery,
} from "./types.js";

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
  sessionId,
  commenter,
}) => {
  return {
    name: "save-comment-by-host-id",
    text: `
        INSERT INTO comments (id, content, hostId, createdAt, updatedAt, sessionId, commenter_displayname, commenter_realname)
        VALUES ($1, $2, $3, NOW(), NOW(), $4, $5, $6)
        RETURNING *;
        `,
    values: [
      id,
      content,
      hostId,
      sessionId,
      commenter.displayName,
      commenter.realName,
    ],
  };
};

const updateCommentByIdQuery: UpdateCommentByIdQuery = ({
  id,
  content,
  sessionId,
}) => {
  return {
    name: "update-comment-by-id",
    text: `
        UPDATE comments
        SET content = $1, updatedAt = NOW()
        WHERE id = $2 AND sessionId = $3
        RETURNING *;
        `,
    values: [content, id, sessionId],
  };
};

const deleteCommentByIdQuery: DeleteCommentByIdQuery = ({ id, sessionId }) => {
  return {
    name: "delete-comment-by-id",
    text: `
        DELETE FROM comments
        WHERE id = $1 AND sessionId = $2
        RETURNING *;
        `,
    values: [id, sessionId],
  };
};

const getCommentByIdQuery: GetCommentByIdQuery = ({ id }) => {
  return {
    name: "get-comment-by-id",
    text: `
        SELECT * FROM comments WHERE id = $1;
        `,
    values: [id],
  };
};

export {
  getAllCommentsByHostIdQuery,
  saveCommentByHostIdQuery,
  updateCommentByIdQuery,
  deleteCommentByIdQuery,
  getCommentByIdQuery,
};
