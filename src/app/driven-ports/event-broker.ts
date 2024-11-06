type CloudEvent = {
  specversion: string;
  type: string;
  source: string;
  subject: string;
  id: string;
  time: string;
  datacontenttype: string;
  data: object;
};

type PublishEvent = ({ event }: { event: CloudEvent }) => void;

type SubscribeToEvent = ({
  type,
  handler,
}: {
  type: string;
  handler: (event: CloudEvent) => void;
}) => void;

type EventBroker = {
  publish: PublishEvent;
  subscribe: SubscribeToEvent;
  stop: () => void;
};

export type { CloudEvent, EventBroker, PublishEvent, SubscribeToEvent };
