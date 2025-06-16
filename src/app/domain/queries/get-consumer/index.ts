import type { DataStore } from "../../../driven-ports/data-store.js";
import type { Consumer, PublicConsumer } from "../../entities/consumer.js";

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
          apiKey: savedConsumer.apikey,
          isActive: savedConsumer.isactive,
          rateLimit: savedConsumer.ratelimit,
        }
      : undefined;
  };
};

export { queryGetConsumer };
