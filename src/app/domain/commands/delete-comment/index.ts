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

    if (commentExists.session_id !== sessionId) {
      throw errors.domain.unauthorized;
    }

    const deletedComment = await dataStore.comment.deleteCommentById({
      id,
      sessionId,
    });

    return {
      id: deletedComment.id,
      content: deletedComment.content,
      hostId: deletedComment.host_id,
      createdAt: deletedComment.created_at,
      updatedAt: deletedComment.updated_at,
      sessionId: deletedComment.session_id,
      commenter: {
        displayName: deletedComment.commenter_display_name,
        realName: deletedComment.commenter_real_name,
      },
    };
  };
};

export { commandDeleteComment };
