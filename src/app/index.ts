import type { App } from "./domain/entities/app.js";
import type { CacheStore } from "./driven-ports/cache-store.js";
import type { Comment } from "./domain/entities/comment.js";
import type { DataStore } from "./driven-ports/data-store.js";
import type { EventBroker } from "./driven-ports/event-broker.js";
import type { ProfanityClient } from "./driven-ports/profanity-client.js";
import type { RandomId } from "./driven-ports/random-id.js";
import { commandCreateComment } from "./domain/commands/create-comment/index.js";
import { commandCreateConsumer } from "./domain/commands/create-consumer/index.js";
import { commandDeleteComment } from "./domain/commands/delete-comment/index.js";
import { commandDeleteConsumer } from "./domain/commands/delete-consumer/index.js";
import { commandUpdateComment } from "./domain/commands/update-comment/index.js";
import { commandUpdateConsumer } from "./domain/commands/update-consumer/index.js";
import { errors } from "./domain/entities/error.js";
import { queryGetAllConsumers } from "./domain/queries/get-all-consumers/index.js";
import { queryGetCommentsForHost } from "./domain/queries/get-comments-for-host/index.js";
import { queryGetConsumer } from "./domain/queries/get-consumer/index.js";
import { queryGetFullConsumer } from "./domain/queries/get-full-consumer/index.js";
import { toCommentCreatedEvent } from "./domain/helpers/events/comment-created.js";
import { toCommentDeletedEvent } from "./domain/helpers/events/comment-deleted.js";
import { toCommentUpdatedEvent } from "./domain/helpers/events/comment-updated.js";

type GetApp = ({
  dataStore,
  eventBroker,
  randomId,
  cacheStore,
  profanityClient,
}: {
  dataStore: DataStore;
  eventBroker: EventBroker;
  randomId: RandomId;
  cacheStore: CacheStore;
  profanityClient: ProfanityClient;
}) => App;

const getApp: GetApp = ({
  dataStore,
  eventBroker,
  randomId,
  cacheStore,
  profanityClient,
}) => {
  return {
    comment: {
      getCommentsForHost: async ({ hostId }) => {
        const cachedComments = cacheStore.get(hostId) as Comment[] | undefined;

        if (cachedComments) {
          return cachedComments;
        }

        const query = queryGetCommentsForHost(dataStore);

        const comments = await query({
          hostId,
        });

        cacheStore.set(hostId, comments);

        return comments;
      },

      createCommentForHost: async ({
        hostId,
        content,
        sessionId,
        commenter,
      }) => {
        const isProfane = await profanityClient.check(content);

        if (isProfane === "PROFANE") {
          throw errors.domain.profaneComment;
        }

        const command = commandCreateComment(dataStore);

        const savedComment = await command({
          hostId,
          content,
          sessionId,
          commenter,
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

      updateCommentById: async ({ id, content, sessionId }) => {
        const isProfane = await profanityClient.check(content);

        if (isProfane === "PROFANE") {
          throw errors.domain.profaneComment;
        }

        const command = commandUpdateComment(dataStore);

        const updatedComment = await command({
          id,
          content,
          sessionId,
        });

        const event = toCommentUpdatedEvent({
          updatedComment: updatedComment,
          subject: id,
          randomId,
          source: "app",
        });

        eventBroker.publish({ event });

        return updatedComment;
      },

      deleteCommentById: async ({ id, sessionId }) => {
        const command = commandDeleteComment(dataStore);

        const deletedComment = await command({
          id,
          sessionId,
        });

        const event = toCommentDeletedEvent({
          deletedComment: deletedComment,
          subject: id,
          randomId,
          source: "app",
        });

        eventBroker.publish({ event });

        return;
      },
    },

    consumer: {
      createConsumer: async ({ consumer }) => {
        const command = commandCreateConsumer(dataStore, randomId);

        const savedConsumer = await command({ consumer });

        return savedConsumer;
      },

      deleteConsumer: async ({ id }) => {
        const command = commandDeleteConsumer(dataStore);

        const deletedConsumer = await command({ id });

        return deletedConsumer;
      },

      updateConsumer: async ({ consumer }) => {
        const command = commandUpdateConsumer(dataStore);

        const updatedConsumer = await command({ consumer });

        return updatedConsumer;
      },

      getConsumerById: async ({ id }) => {
        const query = queryGetConsumer(dataStore);

        const savedConsumer = await query({ id });

        if (!savedConsumer) {
          return undefined;
        }

        return savedConsumer;
      },

      getFullConsumerById: async ({ id }) => {
        const query = queryGetFullConsumer(dataStore);

        const savedConsumer = await query({ id });

        if (!savedConsumer) {
          return undefined;
        }

        return savedConsumer;
      },

      getAllConsumers: async ({ offset = 0, limit = 20 }) => {
        const query = queryGetAllConsumers(dataStore);

        const consumers = await query({ offset, limit });

        return consumers;
      },
    },
  };
};

export { getApp };
