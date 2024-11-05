import type { Comment, PublicComment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type CommandCreateComment = (
  dataStore: DataStore,
) => ({
  hostId,
  content,
  sessionId,
}: {
  hostId: Comment["hostId"];
  content: Comment["content"];
  sessionId: Comment["sessionId"];
}) => Promise<PublicComment>;

const commandCreateComment: CommandCreateComment = (dataStore) => {
  return async ({ hostId, content, sessionId }) => {
    const savedComment = await dataStore.saveCommentByHostId({
      hostId,
      content,
      sessionId,
    });

    return {
      id: savedComment.id,
      content: savedComment.content,
      hostId: savedComment.hostid,
      createdAt: savedComment.createdat,
      updatedAt: savedComment.updatedat,
    };
  };
};

export { commandCreateComment };
