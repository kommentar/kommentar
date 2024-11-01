import type { Comment } from "../domain/entities/comment.js";

type StoredComment = {
  id: Comment["id"];
  content: Comment["content"];
  hostid: Comment["hostId"];
  createdat: Comment["createdAt"];
  updatedat: Comment["updatedAt"];
};

type DataStore = {
  /**
   * Get all comments by host identifier
   *
   * @param hostId - Unique identifier of the host, where the comments are placed
   * @returns List of comments
   */
  getAllCommentsByHostId: ({
    hostId,
  }: {
    hostId: Comment["hostId"];
  }) => Promise<StoredComment[]>;

  /**
   * Save a new comment by host identifier
   *
   * @param hostId - Unique identifier of the host, where the comment is placed
   * @param content - Content of the comment
   * @returns The saved comment
   */
  saveCommentByHostId: ({
    hostId,
    content,
  }: {
    hostId: Comment["hostId"];
    content: Comment["content"];
  }) => Promise<StoredComment>;

  /**
   * Update a comment by identifier
   *
   * @param id - Unique identifier of the comment
   * @param content - New content of the comment
   * @returns The updated comment
   */
  updateCommentById: ({
    id,
    content,
  }: {
    id: Comment["id"];
    content: Comment["content"];
  }) => Promise<StoredComment>;

  /**
   * Delete a comment by identifier
   *
   * @param id - Unique identifier of the comment
   */
  deleteCommentById: ({ id }: { id: Comment["id"] }) => Promise<StoredComment>;
};

export type { DataStore, StoredComment };
