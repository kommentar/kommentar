import type { DataStore } from "./driven-ports/data-store.js";
import type { App } from "./domain/entities/app.js";
import type { EventBroker } from "./driven-ports/event-broker.js";
import type { RandomId } from "./driven-ports/random-id.js";
import { commandCreateComment } from "./commands/create-comment/index.js";

type GetApp = ({
  dataStore,
  eventBroker,
  randomId,
}: {
  dataStore: DataStore;
  eventBroker: EventBroker;
  randomId: RandomId;
}) => App;

const getApp: GetApp = ({ dataStore, eventBroker, randomId }) => {
  return {
    getCommentsForHost: async (hostId) => {
      return await dataStore.getAllCommentsByHostId({ hostId });
    },
    createCommentForHost: async (hostId, content) => {
      const command = commandCreateComment(dataStore);

      const savedComment = await command({
        hostId,
        content,
      });

      eventBroker.publish({
        event: {
          specversion: "1.0",
          type: "comment.created",
          source: "app",
          datacontenttype: "application/json",
          data: savedComment,
          id: randomId.generate(),
          subject: hostId,
          time: new Date().toISOString(),
        },
      });

      return savedComment;
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
