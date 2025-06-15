import type { Comment } from "../domain/entities/comment.js";
import type { Consumer } from "../domain/entities/consumer.js";

type StoredComment = {
  id: Comment["id"];
  content: Comment["content"];
  hostid: Comment["hostId"];
  createdat: Comment["createdAt"];
  updatedat: Comment["updatedAt"];
  sessionid: Comment["sessionId"];
  commenter_displayname: Comment["commenter"]["displayName"];
  commenter_realname?: Comment["commenter"]["realName"];
};

type StoredConsumer = {
  id: Consumer["id"];
  name: Consumer["name"];
  description?: Consumer["description"];
  createdat: Date;
  updatedat: Date;
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
   * @param sessionId - Unique identifier of the session
   * @param commenter - Commenter information
   * @returns The saved comment
   */
  saveCommentByHostId: ({
    hostId,
    content,
    sessionId,
    commenter,
  }: {
    hostId: Comment["hostId"];
    content: Comment["content"];
    sessionId: Comment["sessionId"];
    commenter: Comment["commenter"];
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
    sessionId,
  }: {
    id: Comment["id"];
    content: Comment["content"];
    sessionId: Comment["sessionId"];
  }) => Promise<StoredComment>;

  /**
   * Delete a comment by identifier
   *
   * @param id - Unique identifier of the comment
   */
  deleteCommentById: ({
    id,
    sessionId,
  }: {
    id: Comment["id"];
    sessionId: Comment["sessionId"];
  }) => Promise<StoredComment>;

  /**
   * Get a comment by identifier and session identifier
   *
   * @param id - Unique identifier of the comment
   * @param sessionId - Unique identifier of the session
   * @returns The comment
   */
  getCommentById: ({ id }: { id: Comment["id"] }) => Promise<StoredComment>;

  consumer: {
    /**
     * Get consumer details by consumer identifier
     *
     * @param consumerId - Unique identifier of the consumer
     * @returns Consumer details
     */
    getById: ({
      consumerId,
    }: {
      consumerId: string;
    }) => Promise<StoredConsumer>;

    /**
     * Save a new consumer
     *
     * @param consumer - Consumer details to save
     * @returns The saved consumer
     */
    save: ({ consumer }: { consumer: Consumer }) => Promise<StoredConsumer>;

    /**
     * Update an existing consumer
     *
     * @param consumer - Consumer details to update
     * @returns The updated consumer
     */
    update: ({ consumer }: { consumer: Consumer }) => Promise<StoredConsumer>;

    /**
     * Delete a consumer by identifier
     *
     * @param consumerId - Unique identifier of the consumer
     * @returns The deleted consumer
     */
    deleteById: ({
      consumerId,
    }: {
      consumerId: string;
    }) => Promise<StoredConsumer>;
  };

  /**
   * Close the data store connection
   * @returns Promise that resolves when the connection is closed
   * @throws Error if the connection cannot be closed
   * @remarks This method should be called when the application is shutting down
   */
  stop: () => Promise<void>;

  migrateAll: () => Promise<void>;
  rollbackAll: () => Promise<void>;
};

export type { DataStore, StoredComment, StoredConsumer };
