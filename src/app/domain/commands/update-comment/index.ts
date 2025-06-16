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
    const commentExists = await dataStore.getCommentById({ id });

    if (!commentExists) {
      throw errors.domain.commentNotFound;
    }

    if (commentExists.sessionid !== sessionId) {
      throw errors.domain.unauthorized;
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
