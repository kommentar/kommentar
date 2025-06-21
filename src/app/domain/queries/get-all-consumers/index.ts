import type { DataStore } from "../../../driven-ports/data-store.js";
import type { PublicConsumer } from "../../entities/consumer.js";

type QueryGetAllConsumers = (
  dataStore: DataStore,
) => ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => Promise<PublicConsumer[]>;

const queryGetAllConsumers: QueryGetAllConsumers = (dataStore) => {
  return async ({ offset, limit }) => {
    const consumers = await dataStore.consumer.getAll({
      offset,
      limit,
    });

    if (!consumers || consumers.length === 0) {
      return [];
    }

    return consumers.map((consumer) => ({
      id: consumer.id,
      name: consumer.name,
      description: consumer.description,
      apiKey: consumer.api_key,
      allowedHosts: JSON.parse(consumer.allowed_hosts || "[]"),
      isActive: consumer.is_active,
      rateLimit: consumer.rate_limit,
    }));
  };
};

export { queryGetAllConsumers };
