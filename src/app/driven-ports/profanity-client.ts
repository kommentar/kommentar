type ProfanityCheckResult = "CLEAN" | "PROFANE";

type ProfanityClient = {
  check: (text: string) => Promise<ProfanityCheckResult>;
  stop: () => void;
};

export type { ProfanityClient };
