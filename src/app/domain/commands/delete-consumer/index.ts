import type { DataStore } from "../../../driven-ports/data-store.js";
import type { Consumer } from "../../entities/consumer.js";

type CommandDeleteConsumer = (
  dataStore: DataStore,
) => ({ id }: { id: string }) => Promise<Consumer>;

const commandDeleteConsumer: CommandDeleteConsumer = (dataStore) => {
  return async ({ id }) => {
    const consumerExists = await dataStore.consumer.getById({ consumerId: id });

    if (!consumerExists) {
      throw new Error("Consumer not found");
    }

    const deletedConsumer = await dataStore.consumer.deleteById({
      consumerId: id,
    });

    return {
      id: deletedConsumer.id,
      name: deletedConsumer.name,
      description: deletedConsumer.description,
      apiKey: deletedConsumer.apikey,
      apiSecret: deletedConsumer.apisecret,
      isActive: deletedConsumer.isactive,
      allowedHosts: JSON.parse(String(deletedConsumer.allowedhosts)) || [],
      rateLimit: deletedConsumer.ratelimit,
      createdAt: deletedConsumer.createdat,
      updatedAt: deletedConsumer.updatedat,
    };
  };
};

export { commandDeleteConsumer };
