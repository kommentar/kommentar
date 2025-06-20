import type { Comment, PublicComment } from "../../entities/comment.js";
import type { DataStore } from "../../../driven-ports/data-store.js";

type CommandCreateComment = (
  dataStore: DataStore,
) => ({
  hostId,
  content,
  sessionId,
  commenter,
}: {
  hostId: Comment["hostId"];
  content: Comment["content"];
  sessionId: Comment["sessionId"];
  commenter: Comment["commenter"];
}) => Promise<PublicComment>;

const commandCreateComment: CommandCreateComment = (dataStore) => {
  return async ({ hostId, content, sessionId, commenter }) => {
    const savedComment = await dataStore.comment.saveCommentByHostId({
      hostId,
      content,
      sessionId,
      commenter,
    });

    return {
      id: savedComment.id,
      content: savedComment.content,
      hostId: savedComment.host_id,
      createdAt: savedComment.created_at,
      updatedAt: savedComment.updated_at,
      commenter: {
        displayName: savedComment.commenter_display_name,
        realName: savedComment.commenter_real_name,
      },
    };
  };
};

export { commandCreateComment };
