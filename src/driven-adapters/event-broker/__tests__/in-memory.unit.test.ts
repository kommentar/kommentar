import { describe } from "vitest";
import { getEventBrokerInMemory } from "../in-memory.js";
import { runEventBrokerTests } from "../../../app/driven-ports/__tests__/event-broker.test-runner.js";

describe("EventBrokerInMemory", () => {
  const eventBroker = getEventBrokerInMemory();
  runEventBrokerTests(eventBroker);
});
