import {
  generateApiCredentials,
  hashApiSecret,
} from "./domain/helpers/security/api-key-generator.js";
import {
  toConsumer,
  toPublicComment,
  toPublicConsumer,
} from "./domain/helpers/mappers/from-data-store.js";
import type { App } from "./domain/entities/app.js";
import type { CacheStore } from "./driven-ports/cache-store.js";
import type { Comment } from "./domain/entities/comment.js";
import type { Consumer } from "./domain/entities/consumer.js";
import type { DataStore } from "./driven-ports/data-store.js";
import type { EventBroker } from "./driven-ports/event-broker.js";
import type { ProfanityClient } from "./driven-ports/profanity-client.js";
import type { RandomId } from "./driven-ports/random-id.js";
import { errors } from "./domain/entities/error.js";
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

        const savedComments = await dataStore.comment.getAllCommentsByHostId({
          hostId,
        });

        const comments = savedComments.map(toPublicComment);

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

        const savedComment = await dataStore.comment.saveCommentByHostId({
          hostId,
          content,
          sessionId,
          commenter,
        });

        const comment = toPublicComment(savedComment);

        const event = toCommentCreatedEvent({
          comment,
          subject: hostId,
          randomId,
          source: "app",
        });

        eventBroker.publish({ event });

        return comment;
      },

      updateCommentById: async ({ id, content, sessionId }) => {
        const commentExists = await dataStore.comment.getCommentById({ id });

        if (!commentExists) {
          throw errors.domain.commentNotFound;
        }

        if (commentExists.session_id !== sessionId) {
          throw errors.domain.unauthorized;
        }

        const isProfane = await profanityClient.check(content);

        if (isProfane === "PROFANE") {
          throw errors.domain.profaneComment;
        }

        const updatedComment = await dataStore.comment.updateCommentById({
          id,
          content,
          sessionId,
        });

        const comment = toPublicComment(updatedComment);

        const event = toCommentUpdatedEvent({
          updatedComment: comment,
          subject: id,
          randomId,
          source: "app",
        });

        eventBroker.publish({ event });

        return comment;
      },

      deleteCommentById: async ({ id, sessionId }) => {
        const commentExists = await dataStore.comment.getCommentById({ id });

        if (!commentExists) {
          throw errors.domain.commentNotFound;
        }

        if (commentExists.session_id !== sessionId) {
          throw errors.domain.unauthorized;
        }

        const deletedComment = await dataStore.comment.deleteCommentById({
          id,
          sessionId,
        });

        const comment = toPublicComment(deletedComment);

        const event = toCommentDeletedEvent({
          deletedComment: comment,
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
        const { apiKey, apiSecret } = generateApiCredentials();
        const hashedSecret = hashApiSecret(apiSecret);

        const fullConsumer: Consumer = {
          ...consumer,
          id: randomId.generate(),
          apiKey,
          apiSecret: hashedSecret,
          isActive: consumer.isActive ?? true,
        };

        const savedConsumer = await dataStore.consumer.save({
          consumer: fullConsumer,
        });

        const mappedConsumer = toConsumer(savedConsumer);

        return mappedConsumer;
      },

      deleteConsumer: async ({ id }) => {
        const consumerExists = await dataStore.consumer.getById({
          consumerId: id,
        });

        if (!consumerExists) {
          throw errors.domain.consumerNotFound;
        }

        const deletedConsumer = await dataStore.consumer.deleteById({
          consumerId: id,
        });

        const mappedConsumer = toPublicConsumer(deletedConsumer);

        return mappedConsumer;
      },

      updateConsumer: async ({ consumer }) => {
        const consumerExists = await dataStore.consumer.getById({
          consumerId: consumer.id,
        });

        if (!consumerExists) {
          throw errors.domain.consumerNotFound;
        }

        const updatedConsumer = await dataStore.consumer.update({
          consumer,
        });

        const mappedConsumer = toPublicConsumer(updatedConsumer);

        return mappedConsumer;
      },

      getConsumerById: async ({ id }) => {
        const savedConsumer = await dataStore.consumer.getById({
          consumerId: id,
        });

        if (!savedConsumer) {
          return undefined;
        }

        const mappedConsumer = toPublicConsumer(savedConsumer);

        return mappedConsumer;
      },

      getFullConsumerById: async ({ id }) => {
        const savedConsumer = await dataStore.consumer.getById({
          consumerId: id,
        });

        if (!savedConsumer) {
          return undefined;
        }

        const mappedConsumer = toConsumer(savedConsumer);

        return mappedConsumer;
      },

      getAllConsumers: async ({ offset = 0, limit = 20 }) => {
        const consumers = await dataStore.consumer.getAll({
          offset,
          limit,
        });

        if (!consumers || consumers.length === 0) {
          return [];
        }

        const mappedConsumers = consumers.map(toPublicConsumer);

        return mappedConsumers;
      },
    },
  };
};

export { getApp };
