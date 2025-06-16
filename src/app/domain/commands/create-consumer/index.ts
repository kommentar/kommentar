import type { DataStore } from "../../../driven-ports/data-store.js";
import type { Consumer } from "../../entities/consumer.js";
import {
  generateApiCredentials,
  hashApiSecret,
} from "../../helpers/security/api-key-generator.js";

type CommandCreateConsumer = (
  dataStore: DataStore,
) => ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;

const commandCreateConsumer: CommandCreateConsumer = (dataStore) => {
  return async ({ consumer }) => {
    const { apiKey, apiSecret } = generateApiCredentials();
    const hashedSecret = hashApiSecret(apiSecret);

    const fullConsumer: Consumer = {
      ...consumer,
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
      apiKey: savedConsumer.apikey,
      apiSecret: apiSecret, // Return unhashed secret
      allowedHosts: savedConsumer.allowedhosts
        ? JSON.parse(savedConsumer.allowedhosts)
        : [],
      isActive: savedConsumer.isactive,
      rateLimit: savedConsumer.ratelimit,
    };
  };
};

export { commandCreateConsumer };
