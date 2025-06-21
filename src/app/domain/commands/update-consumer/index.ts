import type { Consumer, PublicConsumer } from "../../entities/consumer.js";
import type { DataStore } from "../../../driven-ports/data-store.js";
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
      apiKey: updatedConsumer.api_key,
      allowedHosts: JSON.parse(updatedConsumer.allowed_hosts) ?? [],
      isActive: updatedConsumer.is_active,
      rateLimit: updatedConsumer.rate_limit,
    };
  };
};

export { commandUpdateConsumer };
