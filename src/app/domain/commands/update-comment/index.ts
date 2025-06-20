import type { Comment, PublicComment } from "../../entities/comment.js";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { errors } from "../../entities/error.js";

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
    const commentExists = await dataStore.comment.getCommentById({ id });

    if (!commentExists) {
      throw errors.domain.commentNotFound;
    }

    if (commentExists.session_id !== sessionId) {
      throw errors.domain.unauthorized;
    }

    const updatedComment = await dataStore.comment.updateCommentById({
      id,
      content,
      sessionId,
    });

    return {
      id: updatedComment.id,
      content: updatedComment.content,
      hostId: updatedComment.host_id,
      createdAt: updatedComment.created_at,
      updatedAt: updatedComment.updated_at,
      commenter: {
        displayName: updatedComment.commenter_display_name,
        realName: updatedComment.commenter_real_name,
      },
    };
  };
};

export { commandUpdateComment };
