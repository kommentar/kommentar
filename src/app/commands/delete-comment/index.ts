import type { Comment } from "../../domain/entities/comment.js";
import { createError } from "../../domain/helpers/error/create-error.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type CommandDeleteComment = (
  dataStore: DataStore,
) => ({ id }: { id: Comment["id"] }) => Promise<Comment>;

const commandDeleteComment: CommandDeleteComment = (dataStore) => {
  return async ({ id }) => {
    const commentExists = await dataStore.getCommentById({ id });

    if (!commentExists) {
      throw createError({
        message: "Comment not found",
        code: "COMMENT_NOT_FOUND",
        status: 404,
      });
    }

    const deletedComment = await dataStore.deleteCommentById({ id });

    const comment: Comment = {
      id: deletedComment.id,
      content: deletedComment.content,
      hostId: deletedComment.hostid,
      createdAt: deletedComment.createdat,
      updatedAt: deletedComment.updatedat,
    };

    return comment;
  };
};

export { commandDeleteComment };
