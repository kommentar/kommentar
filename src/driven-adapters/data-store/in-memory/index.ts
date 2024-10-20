import type { Comment } from "../../../app/domain/entities/comment.js";
import type { DataStore } from "../../../app/driven-ports/data-store.js";

type GetDataStoreInMemory = () => DataStore;

const getDataStoreInMemory: GetDataStoreInMemory = () => {
  const comments = new Map<string, Comment>();
  comments.set("1", {
    id: "1",
    hostId: "1",
    content: "Hello, World! This is a sample comment.",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    async getAllCommentsByHostId({ hostId }) {
      return Array.from(comments.values()).filter(
        (comment) => comment.hostId === hostId,
      );
    },
    async saveCommentByHostId({ hostId, content }) {
      const comment: Comment = {
        id: Math.random().toString(36).slice(2),
        hostId,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      comments.set(comment.id, comment);
      return comment;
    },
    async updateCommentById({ id, content }) {
      const comment = comments.get(id);
      if (!comment) {
        throw new Error(`Comment with id ${id} not found`);
      }
      const updatedComment = { ...comment, content, updatedAt: new Date() };
      comments.set(id, updatedComment);
      return updatedComment;
    },
    async deleteCommentById({ id }) {
      comments.delete(id);
    },
  };
};

export { getDataStoreInMemory };
