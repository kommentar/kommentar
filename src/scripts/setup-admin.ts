import {
  generateApiCredentials,
  hashApiSecret,
} from "../app/domain/helpers/security/api-key-generator.js";

async function setupAdmin() {
  const { apiKey, apiSecret } = generateApiCredentials();
  const hashedSecret = hashApiSecret(apiSecret);

  console.log("🔐 Admin credentials generated!");
  console.log("");
  console.log("Add these to your environment variables:");
  console.log(`ADMIN_API_KEY=${apiKey}`);
  console.log(`ADMIN_API_SECRET_HASH=${hashedSecret}`);
  console.log("");
  console.log(
    "⚠️  IMPORTANT: Save the plain secret below - it won't be shown again!",
  );
  console.log(`Admin API Secret (plain): ${apiSecret}`);
  console.log("");
  console.log("");
  console.log(
    "🔄 Remember to restart your server after setting the environment variables!",
  );
}

setupAdmin().catch(console.error);
