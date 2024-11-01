import type { DataStore } from "./driven-ports/data-store.js";
import type { App } from "./domain/entities/app.js";
import type { EventBroker } from "./driven-ports/event-broker.js";
import type { RandomId } from "./driven-ports/random-id.js";
import { commandCreateComment } from "./commands/create-comment/index.js";
import { commandUpdateComment } from "./commands/update-comment/index.js";
import { commandDeleteComment } from "./commands/delete-comment/index.js";
import { queryGetCommentsForHost } from "./queries/get-comments-for-host/index.js";
import { toCommentCreatedEvent } from "./domain/helpers/events/comment-created.js";
import { toCommentUpdatedEvent } from "./domain/helpers/events/comment-updated.js";
import { toCommentDeletedEvent } from "./domain/helpers/events/comment-deleted.js";
import type { CacheStore } from "./driven-ports/cache-store.js";
import type { Comment } from "./domain/entities/comment.js";

type GetApp = ({
  dataStore,
  eventBroker,
  randomId,
  cacheStore,
}: {
  dataStore: DataStore;
  eventBroker: EventBroker;
  randomId: RandomId;
  cacheStore: CacheStore;
}) => App;

const getApp: GetApp = ({ dataStore, eventBroker, randomId, cacheStore }) => {
  return {
    getCommentsForHost: async ({ hostId }) => {
      const cachedComments = cacheStore.get(hostId) as Comment[] | undefined;

      if (cachedComments) {
        return cachedComments;
      }

      const query = queryGetCommentsForHost(dataStore);

      const comments = await query({
        hostId,
      });

      return comments;
    },
    createCommentForHost: async ({ hostId, content }) => {
      const command = commandCreateComment(dataStore);

      const savedComment = await command({
        hostId,
        content,
      });

      const event = toCommentCreatedEvent({
        comment: savedComment,
        subject: hostId,
        randomId,
        source: "app",
      });

      eventBroker.publish({ event });

      return savedComment;
    },
    updateCommentById: async ({ id, content }) => {
      const command = commandUpdateComment(dataStore);

      const updatedComment = await command({
        id,
        content,
      });

      const event = toCommentUpdatedEvent({
        updatedComment,
        subject: id,
        randomId,
        source: "app",
      });

      eventBroker.publish({ event });

      return updatedComment;
    },
    deleteCommentById: async ({ id }) => {
      const command = commandDeleteComment(dataStore);

      const deletedComment = await command({
        id,
      });

      const event = toCommentDeletedEvent({
        deletedComment,
        subject: id,
        randomId,
        source: "app",
      });

      eventBroker.publish({ event });
    },
  };
};

export { getApp };
