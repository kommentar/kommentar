import EventEmitter from "events";
import type { EventBroker } from "../../app/driven-ports/event-broker.js";

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
  };
};

export { getEventBrokerInMemory };
