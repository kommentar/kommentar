import type { DataStore } from "../../../driven-ports/data-store.js";
import type { Consumer } from "../../entities/consumer.js";

type QueryGetConsumer = (
  dataStore: DataStore,
) => ({ id }: { id: Consumer["id"] }) => Promise<Consumer | undefined>;

const queryGetConsumer: QueryGetConsumer = (dataStore) => {
  return async ({ id }) => {
    const savedConsumer = await dataStore.consumer.getById({ consumerId: id });

    return savedConsumer
      ? {
          id: savedConsumer.id,
          name: savedConsumer.name,
          description: savedConsumer.description,
        }
      : undefined;
  };
};

export { queryGetConsumer };
