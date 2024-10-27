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
    const comment = await dataStore.saveCommentByHostId({ hostId, content });

    return comment;
  };
};

export { commandCreateComment };
