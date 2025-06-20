import type { Comment, PublicComment } from "../../entities/comment.js";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { errors } from "../../entities/error.js";

type CommandDeleteComment = (
  dataStore: DataStore,
) => ({
  id,
  sessionId,
}: {
  id: Comment["id"];
  sessionId: Comment["sessionId"];
}) => Promise<PublicComment>;

const commandDeleteComment: CommandDeleteComment = (dataStore) => {
  return async ({ id, sessionId }) => {
    const commentExists = await dataStore.comment.getCommentById({ id });

    if (!commentExists) {
      throw errors.domain.commentNotFound;
    }

    if (commentExists.sessionid !== sessionId) {
      throw errors.domain.unauthorized;
    }

    const deletedComment = await dataStore.comment.deleteCommentById({
      id,
      sessionId,
    });

    return {
      id: deletedComment.id,
      content: deletedComment.content,
      hostId: deletedComment.hostid,
      createdAt: deletedComment.createdat,
      updatedAt: deletedComment.updatedat,
      sessionId: deletedComment.sessionid,
      commenter: {
        displayName: deletedComment.commenter_displayname,
        realName: deletedComment.commenter_realname,
      },
    };
  };
};

export { commandDeleteComment };
