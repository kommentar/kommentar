import type { PublicComment } from "./comment.js";

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
  }: {
    hostId: string;
    content: string;
    sessionId: string;
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
};

export type { App };
