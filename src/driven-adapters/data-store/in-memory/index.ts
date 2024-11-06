import type {
  DataStore,
  StoredComment,
} from "../../../app/driven-ports/data-store.js";

type GetDataStoreInMemory = () => DataStore;

const getDataStoreInMemory: GetDataStoreInMemory = () => {
  const comments = new Map<string, StoredComment>();
  comments.set("1", {
    id: "1",
    hostid: "1",
    content: "Hello, World! This is a sample comment.",
    createdat: new Date(),
    updatedat: new Date(),
    sessionid: "1",
    commenter_displayname: "John Doe",
  });

  return {
    async getAllCommentsByHostId({ hostId }) {
      return Array.from(comments.values()).filter(
        (comment) => comment.hostid === hostId,
      );
    },
    async saveCommentByHostId({ hostId, content }) {
      const comment: StoredComment = {
        id: Math.random().toString(36).slice(2),
        hostid: hostId,
        content,
        createdat: new Date(),
        updatedat: new Date(),
        sessionid: "1",
        commenter_displayname: "John Doe",
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
      const comment = comments.get(id);
      if (!comment) {
        throw new Error(`Comment with id ${id} not found`);
      }
      comments.delete(id);
      return comment;
    },
    async getCommentById({ id }) {
      const comment = comments.get(id);
      if (!comment) {
        throw new Error(`Comment with id ${id} not found`);
      }
      return comment;
    },
    async stop() {
      // Nothing to do here
    },
  };
};

export { getDataStoreInMemory };
