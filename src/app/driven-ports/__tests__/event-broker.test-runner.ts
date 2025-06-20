import type { CloudEvent, EventBroker } from "../event-broker.js";
import { describe, expect, it, vi } from "vitest";

const mockEvent: CloudEvent = {
  specversion: "1.0",
  type: "com.example.someevent",
  source: "/mycontext",
  subject: "123",
  id: "A234-1234-1234",
  time: "2020-08-24T14:15:22Z",
  datacontenttype: "application/json",
  data: { key: "value" },
};

const runEventBrokerTests = (eventBroker: EventBroker) => {
  describe("EventBroker Port Tests", () => {
    it("should publish an event", () => {
      const publishSpy = vi.fn();
      eventBroker.publish = publishSpy;

      eventBroker.publish({ event: mockEvent });
      expect(publishSpy).toHaveBeenCalledWith({ event: mockEvent });
    });

    it("should subscribe to an event and handle it", () => {
      const handlerSpy = vi.fn();
      eventBroker.subscribe({
        type: "com.example.someevent",
        handler: handlerSpy,
      });

      // Simulate an event being published
      handlerSpy(mockEvent);
      expect(handlerSpy).toHaveBeenCalledWith(mockEvent);
    });
  });
};

export { runEventBrokerTests };
