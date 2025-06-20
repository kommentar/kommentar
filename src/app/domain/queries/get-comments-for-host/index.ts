import type { Comment, PublicComment } from "../../entities/comment.js";
import type { DataStore } from "../../../driven-ports/data-store.js";

type QueryGetCommentsForHost = (
  dataStore: DataStore,
) => ({ hostId }: { hostId: Comment["hostId"] }) => Promise<PublicComment[]>;

const queryGetCommentsForHost: QueryGetCommentsForHost = (dataStore) => {
  return async ({ hostId }) => {
    const savedComments = await dataStore.comment.getAllCommentsByHostId({
      hostId,
    });

    return savedComments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      hostId: comment.host_id,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      commenter: {
        displayName: comment.commenter_display_name,
        realName: comment.commenter_real_name,
      },
    }));
  };
};

export { queryGetCommentsForHost };
