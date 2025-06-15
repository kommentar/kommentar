import type { DataStore } from "../../../driven-ports/data-store.js";
import type { Consumer } from "../../entities/consumer.js";

type CommandCreateConsumer = (
  dataStore: DataStore,
) => ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;

const commandCreateConsumer: CommandCreateConsumer = (dataStore) => {
  return async ({ consumer }) => {
    const savedConsumer = await dataStore.consumer.save({ consumer });

    return {
      id: savedConsumer.id,
      name: savedConsumer.name,
      description: savedConsumer.description,
    };
  };
};

export { commandCreateConsumer };
