import type {
  DataStore,
  StoredComment,
  StoredConsumer,
} from "../../../app/driven-ports/data-store.js";

type GetDataStoreInMemory = () => DataStore;

const getDataStoreInMemory: GetDataStoreInMemory = () => {
  const comments = new Map<string, StoredComment>();
  const consumers = new Map<string, StoredConsumer>();

  comments.set("1", {
    id: "1",
    hostid: "1",
    content: "Hello, World! This is a sample comment.",
    createdat: new Date(),
    updatedat: new Date(),
    sessionid: "1",
    commenter_displayname: "John Doe",
  });

  consumers.set("1", {
    id: "1",
    name: "Sample Consumer",
    description: "This is a sample consumer.",
    createdat: new Date(),
    updatedat: new Date(),
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
    consumer: {
      getById: async ({ consumerId }) => {
        const consumer = consumers.get(consumerId);
        if (!consumer) {
          throw new Error(`Consumer with id ${consumerId} not found`);
        }
        return consumer;
      },
      save: async ({ consumer }) => {
        const newConsumer: StoredConsumer = {
          id: consumer.id,
          name: consumer.name,
          description: consumer.description,
          createdat: new Date(),
          updatedat: new Date(),
        };
        consumers.set(newConsumer.id, newConsumer);
        return newConsumer;
      },
      update: async ({ consumer }) => {
        const existingConsumer = consumers.get(consumer.id);
        if (!existingConsumer) {
          throw new Error(`Consumer with id ${consumer.id} not found`);
        }
        const updatedConsumer: StoredConsumer = {
          ...existingConsumer,
          name: consumer.name,
          description: consumer.description,
          updatedat: new Date(),
        };
        consumers.set(updatedConsumer.id, updatedConsumer);
        return updatedConsumer;
      },
      deleteById: async ({ consumerId }) => {
        const consumer = consumers.get(consumerId);
        if (!consumer) {
          throw new Error(`Consumer with id ${consumerId} not found`);
        }
        consumers.delete(consumerId);
        return consumer;
      },
    },
    async stop() {
      // Nothing to do here
    },
    migrateAll: async () => {
      // No migration needed for in-memory store
      return;
    },
    rollbackAll: async () => {
      // No rollback needed for in-memory store
      return;
    },
  };
};

export { getDataStoreInMemory };
