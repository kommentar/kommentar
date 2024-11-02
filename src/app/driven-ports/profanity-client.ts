type ProfanityCheckResult = "CLEAN" | "PROFANE";

type ProfanityClient = {
  check: (text: string) => Promise<ProfanityCheckResult>;
};

export type { ProfanityClient };
