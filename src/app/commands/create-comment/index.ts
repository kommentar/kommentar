import type { Comment, PublicComment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

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
    const savedComment = await dataStore.saveCommentByHostId({
      hostId,
      content,
      sessionId,
      commenter,
    });

    return {
      id: savedComment.id,
      content: savedComment.content,
      hostId: savedComment.hostid,
      createdAt: savedComment.createdat,
      updatedAt: savedComment.updatedat,
      commenter: {
        displayName: savedComment.commenter_displayname,
        realName: savedComment.commenter_realname,
      },
    };
  };
};

export { commandCreateComment };
