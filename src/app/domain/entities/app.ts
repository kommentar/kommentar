import type { Comment, PublicComment } from "./comment.js";
import type { Consumer, PublicConsumer } from "./consumer.js";

type CommentOperations = {
  getCommentsForHost: ({
    hostId,
  }: {
    hostId: Comment["hostId"];
  }) => Promise<PublicComment[]>;

  createCommentForHost: ({
    hostId,
    content,
    sessionId,
    commenter,
  }: {
    hostId: Comment["hostId"];
    content: Comment["content"];
    sessionId: Comment["sessionId"];
    commenter: Comment["commenter"];
  }) => Promise<PublicComment>;

  updateCommentById: ({
    id,
    content,
    sessionId,
  }: {
    id: Comment["id"];
    content: Comment["content"];
    sessionId: Comment["sessionId"];
  }) => Promise<PublicComment>;

  deleteCommentById: ({
    id,
    sessionId,
  }: {
    id: Comment["id"];
    sessionId: Comment["sessionId"];
  }) => Promise<undefined>;
};

type ConsumerOperations = {
  getConsumerById: ({
    id,
  }: {
    id: Consumer["id"];
  }) => Promise<PublicConsumer | undefined>;
  getFullConsumerById: ({
    id,
  }: {
    id: Consumer["id"];
  }) => Promise<Consumer | undefined>;
  getAllConsumers: ({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }) => Promise<Consumer[]>;
  createConsumer: ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;
  deleteConsumer: ({ id }: { id: Consumer["id"] }) => Promise<Consumer>;
  updateConsumer: ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;
};

type App = {
  comment: CommentOperations;
  consumer: ConsumerOperations;
};

export type { App };
