import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type CommandUpdateComment = (
  dataStore: DataStore,
) => ({
  id,
  content,
}: {
  id: Comment["id"];
  content: Comment["content"];
}) => Promise<Comment>;

const commandUpdateComment: CommandUpdateComment = (dataStore) => {
  return async ({ id, content }) => {
    const updatedComment = await dataStore.updateCommentById({ id, content });

    const comment: Comment = {
      id: updatedComment.id,
      content: updatedComment.content,
      hostId: updatedComment.hostid,
      createdAt: updatedComment.createdat,
      updatedAt: updatedComment.updatedat,
    };

    return comment;
  };
};

export { commandUpdateComment };
