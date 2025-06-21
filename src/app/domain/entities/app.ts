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
  createConsumer: ({ consumer }: { consumer: Consumer }) => Promise<Consumer>;
  deleteConsumer: ({ id }: { id: Consumer["id"] }) => Promise<PublicConsumer>;
  getConsumerById: ({
    id,
  }: {
    id: Consumer["id"];
  }) => Promise<PublicConsumer | undefined>;
  updateConsumer: ({
    consumer,
  }: {
    consumer: Consumer;
  }) => Promise<PublicConsumer>;
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
  }) => Promise<PublicConsumer[]>;
};

type App = {
  comment: CommentOperations;
  consumer: ConsumerOperations;
};

export type { App };
