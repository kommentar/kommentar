import type { DataStore } from "../../../driven-ports/data-store.js";
import type { Consumer, PublicConsumer } from "../../entities/consumer.js";
import { errors } from "../../entities/error.js";

type CommandUpdateConsumer = (
  dataStore: DataStore,
) => ({ consumer }: { consumer: Consumer }) => Promise<PublicConsumer>;

const commandUpdateConsumer: CommandUpdateConsumer = (dataStore) => {
  return async ({ consumer }) => {
    const consumerExists = await dataStore.consumer.getById({
      consumerId: consumer.id,
    });

    if (!consumerExists) {
      throw errors.domain.consumerNotFound;
    }

    const updatedConsumer = await dataStore.consumer.update({
      consumer,
    });

    return {
      id: updatedConsumer.id,
      name: updatedConsumer.name,
      description: updatedConsumer.description,
      apiKey: updatedConsumer.apikey,
      isActive: updatedConsumer.isactive,
      rateLimit: updatedConsumer.ratelimit,
    };
  };
};

export { commandUpdateConsumer };
