import type { Comment } from "./comment.js";

type App = {
  getCommentsForHost: ({ hostId }: { hostId: string }) => Promise<Comment[]>;
  createCommentForHost: ({
    hostId,
    content,
  }: {
    hostId: string;
    content: string;
  }) => Promise<Comment>;
  updateCommentById: ({
    id,
    content,
  }: {
    id: string;
    content: string;
  }) => Promise<Comment>;
  deleteCommentById: ({ id }: { id: string }) => Promise<void>;
};

export type { App };
