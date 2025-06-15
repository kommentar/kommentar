import { getConfigStaticEnv } from "../src/driven-adapters/config/static-env/index.js";
import { getSecretStoreEnv } from "../src/driven-adapters/secrets/env/index.js";
import { getRandomIdUuid } from "../src/driven-adapters/random-id/uuid/index.js";
import { getDataStorePostgres } from "../src/driven-adapters/data-store/postgres/index.js";
import {
  generateApiCredentials,
  hashApiSecret,
} from "../src/app/domain/helpers/security/api-key-generator.js";

async function createTestConsumer() {
  const config = getConfigStaticEnv();
  const secretStore = getSecretStoreEnv();
  const randomId = getRandomIdUuid();

  const dataStore = await getDataStorePostgres({
    config: config.dataStore,
    secretStore,
    randomId,
    shouldMigrate: false,
  });

  try {
    const { apiKey, apiSecret } = generateApiCredentials();
    const hashedSecret = hashApiSecret(apiSecret);

    const testConsumer = {
      id: randomId.generate(),
      name: "Test Consumer",
      description: "Consumer for testing the new authentication system",
      apiKey,
      apiSecret: hashedSecret,
      allowedHosts: [
        "b83d4a57-d1c7-469d-bc39-b9d2279d4cad",
        "615b2c4a-3102-41a2-a274-9fe3fa615fe7",
      ], // Optional: restrict to specific hosts
      isActive: true,
      rateLimit: 100, // 100 requests per minute
    };

    const savedConsumer = await dataStore.consumer.save({
      consumer: testConsumer,
    });

    console.log("✅ Test consumer created successfully!");
    console.log("📋 Consumer Details:");
    console.log(`   ID: ${savedConsumer.id}`);
    console.log(`   Name: ${savedConsumer.name}`);
    console.log(`   API Key: ${savedConsumer.apikey}`);
    console.log(`   API Secret: ${apiSecret}`); // Show the plain secret
    console.log(`   Active: ${savedConsumer.isactive}`);
    console.log(`   Rate Limit: ${savedConsumer.ratelimit}/min`);
    console.log(
      `   Allowed Hosts: ${savedConsumer.allowedhosts || "All hosts"}`,
    );

    console.log("\n🧪 Use these credentials for testing:");
    console.log(`   X-API-Key: ${savedConsumer.apikey}`);
    console.log(`   X-API-Secret: ${apiSecret}`);
  } catch (error) {
    console.error("❌ Error creating test consumer:", error);
  } finally {
    await dataStore.stop();
  }
}

createTestConsumer().catch(console.error);
