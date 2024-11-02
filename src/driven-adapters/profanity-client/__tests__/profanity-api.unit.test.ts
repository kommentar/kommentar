import { describe } from "vitest";
import { getProfanityClientApi } from "../profanity-api/index.js";
import { runProfanityClientUnitTests } from "../../../app/driven-ports/__tests__/profanity-client.unit.test-runner.js";

/**
 * * Even though making an API call is not considered a unit test, it's the convention in this application.
 * * Eventually, this API will be replaced with an end-to-end solution.
 */

describe("ProfanityClientApi", () => {
  const profanityClient = getProfanityClientApi();
  runProfanityClientUnitTests(profanityClient);
});
