import { describe, expect, it, vi } from "vitest";
import type { Comment } from "../../entities/comment.js";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { commandDeleteComment } from "../delete-comment/index.js";

describe("commandDeleteComment", () => {
  it("should delete a comment by id when sessionId is valid", async () => {
    const mockComment: Comment = {
      id: "1",
      content: "Test comment",
      hostId: "host1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    };

    const mockDataStore: DataStore = {
      comment: {
        deleteCommentById: vi.fn().mockResolvedValue({
          id: mockComment.id,
          content: mockComment.content,
          host_id: mockComment.hostId,
          created_at: mockComment.createdAt,
          updated_at: mockComment.updatedAt,
          session_id: mockComment.sessionId,
          commenter_display_name: mockComment.commenter.displayName,
          commenter_real_name: mockComment.commenter.realName,
        }),
        getCommentById: vi.fn().mockResolvedValue({
          id: mockComment.id,
          content: mockComment.content,
          host_id: mockComment.hostId,
          created_at: mockComment.createdAt,
          updated_at: mockComment.updatedAt,
          session_id: mockComment.sessionId,
          commenter_display_name: mockComment.commenter.displayName,
          commenter_real_name: mockComment.commenter.realName,
        }),
        getAllCommentsByHostId: vi.fn(),
        saveCommentByHostId: vi.fn(),
        updateCommentById: vi.fn(),
      },
      consumer: {
        getById: vi.fn(),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
        save: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
      sessionId: "session1",
    };

    const result = await deleteComment(input);

    expect(mockDataStore.comment.deleteCommentById).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockComment);
  });

  it("should throw an error if the comment does not exist", async () => {
    const mockDataStore: DataStore = {
      comment: {
        deleteCommentById: vi.fn(),
        getCommentById: vi.fn().mockResolvedValue(undefined),
        getAllCommentsByHostId: vi.fn(),
        saveCommentByHostId: vi.fn(),
        updateCommentById: vi.fn(),
      },
      consumer: {
        getById: vi.fn(),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
        save: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
      sessionId: "session1",
    };

    await expect(deleteComment(input)).rejects.toThrowError(
      "Comment not found",
    );
    expect(mockDataStore.comment.getCommentById).toHaveBeenCalledWith({
      id: input.id,
    });
    expect(mockDataStore.comment.deleteCommentById).not.toHaveBeenCalled();
  });

  it("should throw an error if the sessionId is invalid", async () => {
    const mockComment: Comment = {
      id: "1",
      content: "Test comment",
      hostId: "host1",
      createdAt: new Date(),
      updatedAt: new Date(),
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    };

    const mockDataStore: DataStore = {
      comment: {
        deleteCommentById: vi.fn(),
        getCommentById: vi.fn().mockResolvedValue(mockComment),
        getAllCommentsByHostId: vi.fn(),
        saveCommentByHostId: vi.fn(),
        updateCommentById: vi.fn(),
      },
      consumer: {
        getById: vi.fn(),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
        save: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
      sessionId: "session2",
    };

    await expect(deleteComment(input)).rejects.toThrowError(
      "Unauthorized access",
    );
    expect(mockDataStore.comment.getCommentById).toHaveBeenCalledWith({
      id: input.id,
    });
    expect(mockDataStore.comment.deleteCommentById).not.toHaveBeenCalled();
  });
});
