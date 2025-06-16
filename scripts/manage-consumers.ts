import { getConfigStaticEnv } from "../src/driven-adapters/config/static-env/index.js";
import { getSecretStoreEnv } from "../src/driven-adapters/secrets/env/index.js";
import { getRandomIdUuid } from "../src/driven-adapters/random-id/uuid/index.js";
import { getDataStorePostgres } from "../src/driven-adapters/data-store/postgres/index.js";
import {
  generateApiCredentials,
  hashApiSecret,
} from "../src/app/domain/helpers/security/api-key-generator.js";
import type { DataStore } from "../src/app/driven-ports/data-store.js";
import type { RandomId } from "../src/app/driven-ports/random-id.js";

type Command =
  | "create"
  | "list"
  | "ls"
  | "activate"
  | "deactivate"
  | "delete"
  | "show";

async function main() {
  const command = process.argv[2] as Command;

  if (
    !command ||
    !["create", "list", "activate", "deactivate", "delete", "show"].includes(
      command,
    )
  ) {
    showUsage();
    process.exit(1);
  }

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
    switch (command) {
      case "create":
        await createConsumer(dataStore, randomId);
        break;
      case "list":
      case "ls":
        await listConsumers(dataStore);
        break;
      case "show":
        await showConsumer(dataStore);
        break;
      case "activate":
        await toggleConsumer(dataStore, true);
        break;
      case "deactivate":
        await toggleConsumer(dataStore, false);
        break;
      case "delete":
        await deleteConsumer(dataStore);
        break;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await dataStore.stop();
  }
}

function showUsage() {
  console.log("🔧 Kommentar | Consumer Management CLI");
  console.log("");
  console.log("Usage:");
  console.log("  pnpm manage <command> [options]");
  console.log("");
  console.log("Commands:");
  console.log("  create <name> [options]     Create a new consumer");
  console.log("  list                        List all consumers");
  console.log("  show <id>                   Show consumer details");
  console.log("  activate <id>               Activate a consumer");
  console.log("  deactivate <id>             Deactivate a consumer");
  console.log("  delete <id>                 Delete a consumer");
  console.log("");
  console.log("Create Options:");
  console.log("  --description <desc>        Consumer description");
  console.log("  --hosts <host1,host2>       Allowed hosts (comma-separated)");
  console.log("  --rate-limit <number>       Rate limit per minute");
  console.log("  --inactive                  Create as inactive");
  console.log("");
  console.log("Examples:");
  console.log(
    '  pnpm manage create "My Blog" --description "Blog comment system"',
  );
  console.log(
    '  pnpm manage create "News Site" --hosts "news-1,news-2" --rate-limit 200',
  );
  console.log("  pnpm manage list");
  console.log("  pnpm manage show <consumer-id>");
  console.log("  pnpm manage deactivate <consumer-id>");
}

function getArgValue(argName: string): string | undefined {
  const index = process.argv.indexOf(argName);
  return index !== -1 && index + 1 < process.argv.length
    ? process.argv[index + 1]
    : undefined;
}

function hasArg(argName: string): boolean {
  return process.argv.includes(argName);
}

async function createConsumer(dataStore: DataStore, randomId: RandomId) {
  const name = process.argv[3];

  if (!name) {
    console.log("❌ Consumer name is required");
    console.log(
      "Usage: pnpm exec tsx scripts/manage-consumers.ts create <name> [options]",
    );
    process.exit(1);
  }

  // Parse options
  const description = getArgValue("--description");
  const hostsArg = getArgValue("--hosts");
  const rateLimitArg = getArgValue("--rate-limit");
  const isInactive = hasArg("--inactive");

  const allowedHosts = hostsArg ? hostsArg.split(",").map((h) => h.trim()) : [];
  const rateLimit = rateLimitArg ? parseInt(rateLimitArg, 10) : undefined;

  if (rateLimitArg && isNaN(rateLimit!)) {
    console.log("❌ Rate limit must be a valid number");
    process.exit(1);
  }

  // Generate credentials
  const { apiKey, apiSecret } = generateApiCredentials();
  const hashedSecret = hashApiSecret(apiSecret);

  const consumer = {
    id: randomId.generate(),
    name,
    description,
    apiKey,
    apiSecret: hashedSecret,
    allowedHosts,
    isActive: !isInactive,
    rateLimit,
  };

  const savedConsumer = await dataStore.consumer.save({ consumer });

  console.log("✅ Consumer created successfully!");
  console.log("");
  console.log("📋 Consumer Details:");
  console.log(`   ID: ${savedConsumer.id}`);
  console.log(`   Name: ${savedConsumer.name}`);
  console.log(`   Description: ${savedConsumer.description || "None"}`);
  console.log(`   Active: ${savedConsumer.isactive}`);
  console.log(
    `   Rate Limit: ${savedConsumer.ratelimit || "Default (25/min)"}`,
  );
  console.log(
    `   Allowed Hosts: ${savedConsumer.allowedhosts ? JSON.parse(savedConsumer.allowedhosts).join(", ") : "All hosts"}`,
  );
  console.log("");
  console.log("🔐 API Credentials (SAVE THESE - they won't be shown again):");
  console.log(`   API Key: ${savedConsumer.apikey}`);
  console.log(`   API Secret: ${apiSecret}`);
  console.log("");
  console.log("🧪 Test with:");
  console.log(
    `   curl -H "X-API-Key: ${savedConsumer.apikey}" -H "X-API-Secret: ${apiSecret}" http://localhost:3000/hosts/test/comments`,
  );
}

async function listConsumers(dataStore: DataStore) {
  try {
    const consumers = await dataStore.consumer.getAll();

    if (consumers.length === 0) {
      console.log("📋 No consumers found");
      return;
    }

    console.log("📋 Consumers List:");
    console.log("");
    consumers.forEach((consumer) => {
      console.log(`- ID: ${consumer.id}`);
      console.log(`  Name: ${consumer.name}`);
      console.log(`  Active: ${consumer.isactive}`);
      console.log(`  Rate Limit: ${consumer.ratelimit || "Default (25/min)"}`);
      console.log(
        `  Allowed Hosts: ${consumer.allowedhosts ? JSON.parse(consumer.allowedhosts).join(", ") : "All hosts"}`,
      );
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error listing consumers:", error);
    process.exit(1);
  }
}

async function showConsumer(dataStore: DataStore) {
  const id = process.argv[3];

  if (!id) {
    console.log("❌ Consumer ID is required");
    console.log(
      "Usage: pnpm exec tsx scripts/manage-consumers.ts show <consumer-id>",
    );
    process.exit(1);
  }

  try {
    const consumer = await dataStore.consumer.getById({ consumerId: id });

    console.log("📋 Consumer Details:");
    console.log(`   ID: ${consumer.id}`);
    console.log(`   Name: ${consumer.name}`);
    console.log(`   Description: ${consumer.description || "None"}`);
    console.log(`   Active: ${consumer.isactive}`);
    console.log(`   Rate Limit: ${consumer.ratelimit || "Default (25/min)"}`);
    console.log(
      `   Allowed Hosts: ${consumer.allowedhosts ? JSON.parse(consumer.allowedhosts).join(", ") : "All hosts"}`,
    );
    console.log(`   API Key: ${consumer.apikey}`);
    console.log(`   Created: ${consumer.createdat}`);
    console.log(`   Updated: ${consumer.updatedat}`);
    console.log("");
    console.log(
      "⚠️  API Secret is hashed and cannot be displayed. If lost, create a new consumer.",
    );
  } catch (error) {
    console.log(`❌ Consumer with ID '${id}' not found`, { error });
    process.exit(1);
  }
}

async function toggleConsumer(dataStore: DataStore, activate: boolean) {
  const id = process.argv[3];

  if (!id) {
    console.log(`❌ Consumer ID is required`);
    console.log(
      `Usage: pnpm exec tsx scripts/manage-consumers.ts ${activate ? "activate" : "deactivate"} <consumer-id>`,
    );
    process.exit(1);
  }

  try {
    // Get current consumer
    const consumer = await dataStore.consumer.getById({ consumerId: id });

    // Update consumer
    const updatedConsumer = {
      id: consumer.id,
      name: consumer.name,
      description: consumer.description,
      apiKey: consumer.apikey,
      apiSecret: consumer.apisecret,
      allowedHosts: consumer.allowedhosts
        ? JSON.parse(consumer.allowedhosts)
        : undefined,
      isActive: activate,
      rateLimit: consumer.ratelimit,
    };

    await dataStore.consumer.update({ consumer: updatedConsumer });

    console.log(
      `✅ Consumer '${consumer.name}' has been ${activate ? "activated" : "deactivated"}`,
    );
  } catch (error) {
    console.log(`❌ Consumer with ID '${id}' not found`, { error });
    process.exit(1);
  }
}

async function deleteConsumer(dataStore: DataStore) {
  const id = process.argv[3];

  if (!id) {
    console.log("❌ Consumer ID is required");
    console.log(
      "Usage: pnpm exec tsx scripts/manage-consumers.ts delete <consumer-id>",
    );
    process.exit(1);
  }

  try {
    const consumer = await dataStore.consumer.getById({ consumerId: id });
    await dataStore.consumer.deleteById({ consumerId: id });

    console.log(`✅ Consumer '${consumer.name}' has been deleted`);
    console.log("⚠️  All API keys for this consumer are now invalid");
  } catch (error) {
    console.log(`❌ Consumer with ID '${id}' not found`, { error });
    process.exit(1);
  }
}

main().catch(console.error);
