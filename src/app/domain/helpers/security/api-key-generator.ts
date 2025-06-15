import crypto from "crypto";

type GenerateApiCredentials = () => {
  apiKey: string;
  apiSecret: string;
};
type HashApiSecret = (secret: string) => string;
type VerifyApiSecret = (secret: string, hashedSecret: string) => boolean;

const generateApiCredentials: GenerateApiCredentials = () => {
  // Generate API key: km_ prefix + 32 random chars
  const apiKey = "km_" + crypto.randomBytes(16).toString("hex");

  // Generate API secret: 64 random chars
  const apiSecret = crypto.randomBytes(32).toString("hex");

  return { apiKey, apiSecret };
};

const hashApiSecret: HashApiSecret = (secret) => {
  return crypto.createHash("sha256").update(secret).digest("hex");
};

const verifyApiSecret: VerifyApiSecret = (secret, hashedSecret) => {
  const hashedInput = hashApiSecret(secret);
  return crypto.timingSafeEqual(
    Buffer.from(hashedInput),
    Buffer.from(hashedSecret),
  );
};

export { generateApiCredentials, hashApiSecret, verifyApiSecret };
