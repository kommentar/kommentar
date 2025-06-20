import type {
  DeleteCommentByIdQuery,
  DeleteConsumerQuery,
  GetAllCommentsByHostIdQuery,
  GetCommentByIdQuery,
  GetConsumerByApiKeyQuery,
  GetConsumerByIdQuery,
  SaveCommentByHostIdQuery,
  SaveConsumerQuery,
  UpdateCommentByIdQuery,
  UpdateConsumerQuery,
} from "./types.js";

const getAllCommentsByHostIdQuery: GetAllCommentsByHostIdQuery = ({
  hostId,
}) => {
  return {
    name: "get-all-comments-by-host-id",
    text: `
        SELECT * FROM kommentar.comments WHERE host_id = $1;
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
        INSERT INTO kommentar.comments (id, content, host_id, created_at, updated_at, session_id, commenter_display_name, commenter_real_name)
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
        UPDATE kommentar.comments
        SET content = $1, updated_at = NOW()
        WHERE id = $2 AND session_id = $3
        RETURNING *;
        `,
    values: [content, id, sessionId],
  };
};

const deleteCommentByIdQuery: DeleteCommentByIdQuery = ({ id, sessionId }) => {
  return {
    name: "delete-comment-by-id",
    text: `
        DELETE FROM kommentar.comments
        WHERE id = $1 AND session_id = $2
        RETURNING *;
        `,
    values: [id, sessionId],
  };
};

const getCommentByIdQuery: GetCommentByIdQuery = ({ id }) => {
  return {
    name: "get-comment-by-id",
    text: `
        SELECT * FROM kommentar.comments WHERE id = $1;
        `,
    values: [id],
  };
};

const getConsumerByIdQuery: GetConsumerByIdQuery = ({ consumerId }) => {
  return {
    name: "get-consumer-by-id",
    text: `
        SELECT * FROM kommentar.consumer WHERE id = $1 LIMIT 1;
        `,
    values: [consumerId],
  };
};

const getConsumerByApiKeyQuery: GetConsumerByApiKeyQuery = ({ apiKey }) => {
  return {
    name: "get-consumer-by-api-key",
    text: `
        SELECT * FROM kommentar.consumer WHERE api_key = $1 AND is_active = true LIMIT 1;
        `,
    values: [apiKey],
  };
};

const saveConsumerQuery: SaveConsumerQuery = ({ consumer }) => {
  return {
    name: "save-consumer",
    text: `
        INSERT INTO kommentar.consumer (
          id, name, description, api_key, api_secret, allowed_hosts, is_active, rate_limit, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *;
        `,
    values: [
      consumer.id,
      consumer.name,
      consumer.description,
      consumer.apiKey,
      consumer.apiSecret,
      JSON.stringify(consumer.allowedHosts),
      consumer.isActive,
      consumer.rateLimit,
    ],
  };
};

const updateConsumerQuery: UpdateConsumerQuery = ({ consumer }) => {
  return {
    name: "update-consumer",
    text: `
        UPDATE kommentar.consumer
        SET name = $1, description = $2, api_key = $3, api_secret = $4,
            allowed_hosts = $5, is_active = $6, rate_limit = $7, updated_at = NOW()
        WHERE id = $8
        RETURNING *;
        `,
    values: [
      consumer.name,
      consumer.description,
      consumer.apiKey,
      consumer.apiSecret,
      JSON.stringify(consumer.allowedHosts),
      consumer.isActive,
      consumer.rateLimit,
      consumer.id,
    ],
  };
};

const deleteConsumerQuery: DeleteConsumerQuery = ({ consumerId }) => {
  return {
    name: "delete-consumer",
    text: `
        DELETE FROM kommentar.consumer
        WHERE id = $1
        RETURNING *;
        `,
    values: [consumerId],
  };
};

export {
  getAllCommentsByHostIdQuery,
  saveCommentByHostIdQuery,
  updateCommentByIdQuery,
  deleteCommentByIdQuery,
  getCommentByIdQuery,
  getConsumerByIdQuery,
  getConsumerByApiKeyQuery,
  saveConsumerQuery,
  updateConsumerQuery,
  deleteConsumerQuery,
};
