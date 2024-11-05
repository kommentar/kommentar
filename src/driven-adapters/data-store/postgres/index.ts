import type { Config } from "../../../app/driven-ports/config.js";
import type { DataStore } from "../../../app/driven-ports/data-store.js";
import type { RandomId } from "../../../app/driven-ports/random-id.js";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";
import { migrate } from "./migrate.js";
import { getPgPool } from "./pool.js";
import {
  deleteCommentByIdQuery,
  getAllCommentsByHostIdQuery,
  getCommentByIdQuery,
  saveCommentByHostIdQuery,
  updateCommentByIdQuery,
} from "./queries.js";

type GetDataStorePostgres = ({
  config,
  secretStore,
  randomId,
}: {
  config: Config["dataStore"];
  secretStore: SecretStore;
  randomId: RandomId;
}) => Promise<DataStore>;

const getDataStorePostgres: GetDataStorePostgres = async ({
  config,
  secretStore,
  randomId,
}) => {
  const pgPool = getPgPool({ config, secretStore });

  await migrate({ pgPool });

  return {
    getAllCommentsByHostId: async ({ hostId }) => {
      try {
        const result = await pgPool.query(
          getAllCommentsByHostIdQuery({ hostId }),
        );

        return result.rows;
      } catch (error) {
        console.error("Failed to get comments by host identifier", error);
        throw error;
      }
    },
    saveCommentByHostId: async ({ hostId, content, sessionId }) => {
      try {
        const id = randomId.generate();
        const result = await pgPool.query(
          saveCommentByHostIdQuery({ id, hostId, content, sessionId }),
        );

        return result.rows[0];
      } catch (error) {
        console.error("Failed to save comment by host identifier", error);
        throw error;
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
        throw error;
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
        throw error;
      }
    },
    getCommentById: async ({ id }) => {
      try {
        const result = await pgPool.query(getCommentByIdQuery({ id }));

        return result.rows[0];
      } catch (error) {
        console.error("Failed to get comment by identifier", error);
        throw error;
      }
    },
  };
};

export { getDataStorePostgres };
