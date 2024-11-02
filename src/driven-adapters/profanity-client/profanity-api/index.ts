import type { ProfanityClient } from "../../../app/driven-ports/profanity-client.js";
import { checkProfanityRequest } from "./request.js";

type GetProfanityClientApi = () => ProfanityClient;

const getProfanityClientApi: GetProfanityClientApi = () => {
  return {
    check: async (text) => {
      const response = await checkProfanityRequest(text);

      return response.isProfanity ? "PROFANE" : "CLEAN";
    },
  };
};

export { getProfanityClientApi };
