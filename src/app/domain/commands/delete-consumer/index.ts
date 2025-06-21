import type { Consumer, PublicConsumer } from "../../entities/consumer.js";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { errors } from "../../entities/error.js";

type CommandDeleteConsumer = (
  dataStore: DataStore,
) => ({ id }: { id: Consumer["id"] }) => Promise<PublicConsumer>;

const commandDeleteConsumer: CommandDeleteConsumer = (dataStore) => {
  return async ({ id }) => {
    const consumerExists = await dataStore.consumer.getById({ consumerId: id });

    if (!consumerExists) {
      throw errors.domain.consumerNotFound;
    }

    const deletedConsumer = await dataStore.consumer.deleteById({
      consumerId: id,
    });

    return {
      id: deletedConsumer.id,
      name: deletedConsumer.name,
      description: deletedConsumer.description ?? "",
      apiKey: deletedConsumer.api_key,
      allowedHosts: JSON.parse(deletedConsumer.allowed_hosts) ?? [],
      isActive: deletedConsumer.is_active,
      rateLimit: deletedConsumer.rate_limit,
    };
  };
};

export { commandDeleteConsumer };
