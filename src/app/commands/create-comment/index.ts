import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type CommandCreateComment = (
  dataStore: DataStore,
) => ({
  hostId,
  content,
}: {
  hostId: Comment["hostId"];
  content: Comment["content"];
}) => Promise<Comment>;

const commandCreateComment: CommandCreateComment = (dataStore) => {
  return async ({ hostId, content }) => {
    const savedComment = await dataStore.saveCommentByHostId({
      hostId,
      content,
    });

    const comment: Comment = {
      id: savedComment.id,
      content: savedComment.content,
      hostId: savedComment.hostid,
      createdAt: savedComment.createdat,
      updatedAt: savedComment.updatedat,
    };

    return comment;
  };
};

export { commandCreateComment };
