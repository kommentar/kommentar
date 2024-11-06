import type { Comment, PublicComment } from "../../domain/entities/comment.js";
import { createError } from "../../domain/helpers/error/create-error.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type CommandUpdateComment = (
  dataStore: DataStore,
) => ({
  id,
  content,
  sessionId,
}: {
  id: Comment["id"];
  content: Comment["content"];
  sessionId: Comment["sessionId"];
}) => Promise<PublicComment>;

const commandUpdateComment: CommandUpdateComment = (dataStore) => {
  return async ({ id, content, sessionId }) => {
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
        message: "Cannot update comment",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    const updatedComment = await dataStore.updateCommentById({
      id,
      content,
      sessionId,
    });

    return {
      id: updatedComment.id,
      content: updatedComment.content,
      hostId: updatedComment.hostid,
      createdAt: updatedComment.createdat,
      updatedAt: updatedComment.updatedat,
      commenter: {
        displayName: updatedComment.commenter_displayname,
        realName: updatedComment.commenter_realname,
      },
    };
  };
};

export { commandUpdateComment };
