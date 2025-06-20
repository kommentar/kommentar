import {
  generateApiCredentials,
  hashApiSecret,
} from "../../helpers/security/api-key-generator.js";
import type { Consumer } from "../../entities/consumer.js";
import type { DataStore } from "../../../driven-ports/data-store.js";
import type { RandomId } from "../../../driven-ports/random-id.js";

type CommandCreateConsumer = (
  dataStore: DataStore,
  randomId: RandomId,
) => ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;

const commandCreateConsumer: CommandCreateConsumer = (dataStore, randomId) => {
  return async ({ consumer }) => {
    const { apiKey, apiSecret } = generateApiCredentials();
    const hashedSecret = hashApiSecret(apiSecret);

    const fullConsumer: Consumer = {
      ...consumer,
      id: randomId.generate(),
      apiKey,
      apiSecret: hashedSecret,
      isActive: consumer.isActive ?? true,
    };

    const savedConsumer = await dataStore.consumer.save({
      consumer: fullConsumer,
    });

    return {
      id: savedConsumer.id,
      name: savedConsumer.name,
      description: savedConsumer.description,
      apiKey: savedConsumer.api_key,
      apiSecret: apiSecret, // Return unhashed secret
      allowedHosts: savedConsumer.allowed_hosts
        ? JSON.parse(savedConsumer.allowed_hosts)
        : [],
      isActive: savedConsumer.is_active,
      rateLimit: savedConsumer.rate_limit,
    };
  };
};

export { commandCreateConsumer };
