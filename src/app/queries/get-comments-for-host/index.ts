import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type QueryGetCommentsForHost = (
  dataStore: DataStore,
) => ({ hostId }: { hostId: Comment["hostId"] }) => Promise<Comment[]>;

const queryGetCommentsForHost: QueryGetCommentsForHost = (dataStore) => {
  return async ({ hostId }) => {
    const savedComments = await dataStore.getAllCommentsByHostId({ hostId });

    const comments: Comment[] = savedComments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      hostId: comment.hostid,
      createdAt: comment.createdat,
      updatedAt: comment.updatedat,
    }));

    return comments;
  };
};

export { queryGetCommentsForHost };
