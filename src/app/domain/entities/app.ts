import type { PublicComment } from "./comment.js";
import type { Consumer } from "./consumer.js";

type App = {
  getCommentsForHost: ({
    hostId,
  }: {
    hostId: string;
  }) => Promise<PublicComment[]>;

  createCommentForHost: ({
    hostId,
    content,
    sessionId,
    commenter,
  }: {
    hostId: string;
    content: string;
    sessionId: string;
    commenter: {
      displayName: string;
      realName?: string;
    };
  }) => Promise<PublicComment>;

  updateCommentById: ({
    id,
    content,
    sessionId,
  }: {
    id: string;
    content: string;
    sessionId: string;
  }) => Promise<PublicComment>;

  deleteCommentById: ({
    id,
    sessionId,
  }: {
    id: string;
    sessionId: string;
  }) => Promise<undefined>;

  createConsumer: ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;
  deleteConsumer: ({ id }: { id: string }) => Promise<Consumer>;
  getConsumerById: ({ id }: { id: string }) => Promise<Consumer | undefined>;
  updateConsumer: ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;
};

export type { App };
