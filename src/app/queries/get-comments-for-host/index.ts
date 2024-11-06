import type { Comment, PublicComment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type QueryGetCommentsForHost = (
  dataStore: DataStore,
) => ({ hostId }: { hostId: Comment["hostId"] }) => Promise<PublicComment[]>;

const queryGetCommentsForHost: QueryGetCommentsForHost = (dataStore) => {
  return async ({ hostId }) => {
    const savedComments = await dataStore.getAllCommentsByHostId({ hostId });

    return savedComments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      hostId: comment.hostid,
      createdAt: comment.createdat,
      updatedAt: comment.updatedat,
      commenter: {
        displayName: comment.commenter_displayname,
        realName: comment.commenter_realname,
      },
    }));
  };
};

export { queryGetCommentsForHost };
