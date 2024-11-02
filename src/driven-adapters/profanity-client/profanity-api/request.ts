type ProfanityResponse = {
  isProfanity: boolean;
  score: number;
  flaggedFor: string;
};
type CheckProfanityRequest = (text: string) => Promise<ProfanityResponse>;

const checkProfanityRequest: CheckProfanityRequest = async (text) => {
  const request = new Request("https://vector.profanity.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text }),
  });

  const response = await fetch(request);

  if (!response.ok) {
    throw new Error("Failed to check profanity");
  }

  const data = await response.json();

  return data;
};

export { checkProfanityRequest };
