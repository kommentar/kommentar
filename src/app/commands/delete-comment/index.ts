import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type CommandDeleteComment = (
  dataStore: DataStore,
) => ({ id }: { id: Comment["id"] }) => Promise<Comment>;

const commandDeleteComment: CommandDeleteComment = (dataStore) => {
  return async ({ id }) => {
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
