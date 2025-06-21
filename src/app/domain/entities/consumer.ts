type Consumer = {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  apiSecret: string;
  allowedHosts: string[] | []; // Optional: restrict to specific hosts
  isActive: boolean;
  rateLimit: number; // requests per minute, defaults to global limit
};

type PublicConsumer = Omit<Consumer, "apiSecret">;

export type { Consumer, PublicConsumer };
