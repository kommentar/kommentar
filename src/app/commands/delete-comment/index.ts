import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";

type CommandDeleteComment = (
  dataStore: DataStore,
) => ({ id }: { id: Comment["id"] }) => Promise<void>;

const commandDeleteComment: CommandDeleteComment = (dataStore) => {
  return async ({ id }) => {
    await dataStore.deleteCommentById({ id });
  };
};

export { commandDeleteComment };
