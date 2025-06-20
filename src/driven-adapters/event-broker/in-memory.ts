import type { EventBroker } from "../../app/driven-ports/event-broker.js";
import EventEmitter from "events";

type GetEventBrokerInMemory = () => EventBroker;

const getEventBrokerInMemory: GetEventBrokerInMemory = () => {
  const eventEmitter = new EventEmitter();

  return {
    publish: ({ event }) => {
      eventEmitter.emit(event.type, event);
    },
    subscribe: ({ type, handler }) => {
      eventEmitter.on(type, handler);
    },
    stop: () => {
      eventEmitter.removeAllListeners();
    },
  };
};

export { getEventBrokerInMemory };
