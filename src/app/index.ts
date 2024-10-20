import type { DataStore } from "./driven-ports/data-store.js";
import type { App } from "./domain/entities/app.js";

type GetApp = ({ dataStore }: { dataStore: DataStore }) => App;

const getApp: GetApp = ({ dataStore }) => {
  return {
    getCommentsForHost: async (hostId) => {
      return await dataStore.getAllCommentsByHostId({ hostId });
    },
    createCommentForHost: async (hostId, content) => {
      return await dataStore.saveCommentByHostId({ hostId, content });
    },
    updateCommentById: async (id, content) => {
      return await dataStore.updateCommentById({ id, content });
    },
    deleteCommentById: async (id) => {
      return await dataStore.deleteCommentById({ id });
    },
  };
};

export { getApp };
