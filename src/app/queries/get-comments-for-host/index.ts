import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type QueryGetCommentsForHost = (
  dataStore: DataStore,
) => ({ hostId }: { hostId: Comment["hostId"] }) => Promise<Comment[]>;

const queryGetCommentsForHost: QueryGetCommentsForHost = (dataStore) => {
  return async ({ hostId }) => {
    const comment = await dataStore.getAllCommentsByHostId({ hostId });

    return comment;
  };
};

export { queryGetCommentsForHost };
