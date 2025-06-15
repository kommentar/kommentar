import type { DataStore } from "../../../driven-ports/data-store.js";
import type { Consumer } from "../../entities/consumer.js";

type CommandUpdateConsumer = (
  dataStore: DataStore,
) => ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;

const commandUpdateConsumer: CommandUpdateConsumer = (dataStore) => {
  return async ({ consumer }) => {
    const consumerExists = await dataStore.consumer.getById({
      consumerId: consumer.id,
    });

    if (!consumerExists) {
      throw new Error("Consumer not found");
    }

    const updatedConsumer = await dataStore.consumer.update({
      consumer,
    });

    return {
      id: updatedConsumer.id,
      name: updatedConsumer.name,
      description: updatedConsumer.description,
    };
  };
};

export { commandUpdateConsumer };
