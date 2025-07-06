import {
  deleteCommentByIdQuery,
  deleteConsumerQuery,
  getAllCommentsByHostIdQuery,
  getAllConsumersQuery,
  getCommentByIdQuery,
  getConsumerByApiKeyQuery,
  getConsumerByIdQuery,
  getConsumerCountQuery,
  saveCommentByHostIdQuery,
  saveConsumerQuery,
  updateCommentByIdQuery,
  updateConsumerQuery,
} from "./queries.js";
import { migrate, rollback } from "./migrate/index.js";
import type { Config } from "../../../app/driven-ports/config.js";
import type { DataStore } from "../../../app/driven-ports/data-store.js";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";
import { errors } from "../../../app/domain/entities/error.js";
import { getPgPool } from "./pool.js";

type GetDataStorePostgres = ({
  config,
  secretStore,
  randomId,
  shouldMigrate,
}: {
  config: Config["dataStore"];
  secretStore: SecretStore;
  randomId: RandomId;
  shouldMigrate: boolean;
}) => Promise<DataStore>;

const getDataStorePostgres: GetDataStorePostgres = async ({
  config,
  secretStore,
  randomId,
  shouldMigrate = true,
}) => {
  const pgPool = getPgPool({ config, secretStore });

  if (shouldMigrate) {
    await migrate({ pgPool });
  }

  return {
    comment: {
      getAllCommentsByHostId: async ({ hostId }) => {
        try {
          const result = await pgPool.query(
            getAllCommentsByHostIdQuery({ hostId }),
          );

          return result.rows;
        } catch (error) {
          console.error("Failed to get comments by host identifier", error);
          throw errors.dependency.dataStoreError;
        }
      },
      saveCommentByHostId: async ({
        hostId,
        content,
        sessionId,
        commenter,
      }) => {
        try {
          const id = randomId.generate();
          const result = await pgPool.query(
            saveCommentByHostIdQuery({
              id,
              hostId,
              content,
              sessionId,
              commenter,
            }),
          );

          return result.rows[0];
        } catch (error) {
          console.error("Failed to save comment by host identifier", error);
          throw errors.dependency.dataStoreError;
        }
      },
      updateCommentById: async ({ id, content, sessionId }) => {
        try {
          const result = await pgPool.query(
            updateCommentByIdQuery({ id, content, sessionId }),
          );

          return result.rows[0];
        } catch (error) {
          console.error("Failed to update comment by identifier", error);
          throw errors.dependency.dataStoreError;
        }
      },
      deleteCommentById: async ({ id, sessionId }) => {
        try {
          const result = await pgPool.query(
            deleteCommentByIdQuery({ id, sessionId }),
          );

          return result.rows[0];
        } catch (error) {
          console.error("Failed to delete comment by identifier", error);
          throw errors.dependency.dataStoreError;
        }
      },
      getCommentById: async ({ id }) => {
        try {
          const result = await pgPool.query(getCommentByIdQuery({ id }));

          return result.rows[0];
        } catch (error) {
          console.error("Failed to get comment by identifier", error);
          throw errors.dependency.dataStoreError;
        }
      },
    },
    consumer: {
      getCount: async () => {
        try {
          const result = await pgPool.query(getConsumerCountQuery());
          return parseInt(result.rows[0].total, 10);
        } catch (error) {
          console.error("Failed to get consumer count", error);
          throw errors.dependency.dataStoreError;
        }
      },
      getById: async ({ consumerId }) => {
        try {
          const result = await pgPool.query(
            getConsumerByIdQuery({ consumerId }),
          );

          return result.rows[0];
        } catch (error) {
          console.error("Failed to get consumer by identifier", error);
          throw errors.dependency.dataStoreError;
        }
      },
      getAll: async ({ offset, limit }) => {
        try {
          const result = await pgPool.query(
            getAllConsumersQuery({ offset, limit }),
          );
          return result.rows;
        } catch (error) {
          console.error("Failed to get all consumers", error);
          throw errors.dependency.dataStoreError;
        }
      },
      getByApiKey: async ({ apiKey }) => {
        try {
          const result = await pgPool.query(
            getConsumerByApiKeyQuery({ apiKey }),
          );

          return result.rows[0] || null;
        } catch (error) {
          console.error("Failed to get consumer by API key", error);
          throw errors.dependency.dataStoreError;
        }
      },
      save: async ({ consumer }) => {
        try {
          const result = await pgPool.query(saveConsumerQuery({ consumer }));

          return result.rows[0];
        } catch (error) {
          console.error("Failed to save consumer", error);
          throw errors.dependency.dataStoreError;
        }
      },
      update: async ({ consumer }) => {
        try {
          const existingConsumer = await pgPool.query(
            getConsumerByIdQuery({ consumerId: consumer.id }),
          );

          if (existingConsumer.rows.length === 0) {
            throw errors.domain.consumerNotFound;
          }

          const result = await pgPool.query(updateConsumerQuery({ consumer }));

          return result.rows[0];
        } catch (error) {
          console.error("Failed to update consumer", error);
          throw errors.dependency.dataStoreError;
        }
      },
      deleteById: async ({ consumerId }) => {
        try {
          const existingConsumer = await pgPool.query(
            getConsumerByIdQuery({ consumerId }),
          );

          if (existingConsumer.rows.length === 0) {
            throw errors.domain.consumerNotFound;
          }

          const result = await pgPool.query(
            deleteConsumerQuery({ consumerId }),
          );

          return result.rows[0];
        } catch (error) {
          console.error("Failed to delete consumer", error);
          throw errors.dependency.dataStoreError;
        }
      },
    },
    stop: async () => {
      /**
       * This will wait for all the clients to finish their operations and then
       * close the pool.
       *
       * Reference: https://node-postgres.com/features/pooling#shutdown
       */
      await pgPool.end();
    },
    migrateAll: async () => {
      await migrate({ pgPool });
    },
    rollbackAll: async () => {
      await rollback({ pgPool, targetMigration: "0" });
    },
  };
};

export { getDataStorePostgres };
