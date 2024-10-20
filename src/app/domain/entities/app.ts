import type { Comment } from "./comment.js";

type App = {
  getCommentsForHost: (hostId: string) => Promise<Comment[]>;
  createCommentForHost: (hostId: string, content: string) => Promise<Comment>;
  updateCommentById: (id: string, content: string) => Promise<Comment>;
  deleteCommentById: (id: string) => Promise<void>;
};

export type { App };
