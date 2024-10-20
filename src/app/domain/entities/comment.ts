type Comment = {
  /**
   * Unique identifier of the comment
   */
  id: string;
  /**
   * Content of the comment
   */
  content: string;
  /**
   * Unique identifier of the host, where the comment is placed (e.g. post, video, etc.)
   */
  hostId: string;
  /**
   * Date when the comment was created
   */
  createdAt: Date;
  /**
   * Date when the comment was last updated
   */
  updatedAt: Date;
};

export type { Comment };
