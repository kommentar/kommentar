import type { Consumer, PublicConsumer } from "../../entities/consumer.js";
import type { DataStore } from "../../../driven-ports/data-store.js";

type QueryGetConsumer = (
  dataStore: DataStore,
) => ({ id }: { id: Consumer["id"] }) => Promise<PublicConsumer | undefined>;

const queryGetConsumer: QueryGetConsumer = (dataStore) => {
  return async ({ id }) => {
    const savedConsumer = await dataStore.consumer.getById({ consumerId: id });

    return savedConsumer
      ? {
          id: savedConsumer.id,
          name: savedConsumer.name,
          description: savedConsumer.description,
          apiKey: savedConsumer.api_key,
          allowedHosts: JSON.parse(savedConsumer.allowed_hosts) ?? [],
          isActive: savedConsumer.is_active,
          rateLimit: savedConsumer.rate_limit,
        }
      : undefined;
  };
};

export { queryGetConsumer };
