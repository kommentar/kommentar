import type { Comment, PublicComment } from "../../domain/entities/comment.js";
import { createError } from "../../domain/helpers/error/create-error.js";
import type { DataStore } from "../../driven-ports/data-store.js";

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
    const commentExists = await dataStore.getCommentById({ id });

    if (!commentExists) {
      throw createError({
        message: "Comment not found",
        code: "COMMENT_NOT_FOUND",
        status: 404,
      });
    }

    if (commentExists.sessionid !== sessionId) {
      throw createError({
        message: "Cannot delete comment",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    const deletedComment = await dataStore.deleteCommentById({ id, sessionId });

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
