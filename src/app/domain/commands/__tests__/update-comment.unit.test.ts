import { describe, expect, it, vi } from "vitest";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { commandUpdateComment } from "../update-comment/index.js";

describe("commandUpdateComment", () => {
  it("should update a comment and return it", async () => {
    const mockDataStore: DataStore = {
      comment: {
        updateCommentById: vi.fn().mockResolvedValue({
          id: "1",
          content: "Updated content",
          session_id: "session1",
          host_id: "host1",
          created_at: new Date("2021-01-01"),
          updated_at: new Date("2021-01-01"),
          commenter_display_name: "John Doe",
          commenter_real_name: "",
        }),
        getCommentById: vi.fn().mockResolvedValue({
          id: "1",
          content: "Test comment",
          host_id: "host1",
          created_at: new Date("2021-01-01"),
          updated_at: new Date("2021-01-01"),
          session_id: "session1",
          commenter_display_name: "John Doe",
          commenter_real_name: "",
        }),
        deleteCommentById: vi.fn(),
        getAllCommentsByHostId: vi.fn(),
        saveCommentByHostId: vi.fn(),
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

    const updateComment = commandUpdateComment(mockDataStore);

    const input = {
      id: "1",
      content: "Updated content",
      sessionId: "session1",
    };

    const result = await updateComment(input);

    expect(mockDataStore.comment.updateCommentById).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: "1",
      content: "Updated content",
      hostId: "host1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    });
  });

  it("should throw an error if the comment does not exist", async () => {
    const mockDataStore: DataStore = {
      comment: {
        updateCommentById: vi.fn(),
        getCommentById: vi.fn().mockResolvedValue(null),
        deleteCommentById: vi.fn(),
        getAllCommentsByHostId: vi.fn(),
        saveCommentByHostId: vi.fn(),
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

    const updateComment = commandUpdateComment(mockDataStore);

    const input = {
      id: "1",
      content: "Updated content",
      sessionId: "session1",
    };

    await expect(updateComment(input)).rejects.toThrowError(
      "Comment not found",
    );
    expect(mockDataStore.comment.getCommentById).toHaveBeenCalledWith({
      id: input.id,
    });
    expect(mockDataStore.comment.updateCommentById).not.toHaveBeenCalled();
  });

  it("should throw an error if the sessionId is invalid", async () => {
    const mockComment = {
      id: "1",
      content: "Test comment",
      hostId: "host1",
      createdAt: new Date(),
      updatedAt: new Date(),
      sessionId: "session1",
    };

    const mockDataStore: DataStore = {
      comment: {
        updateCommentById: vi.fn(),
        getCommentById: vi.fn().mockResolvedValue(mockComment),
        deleteCommentById: vi.fn(),
        getAllCommentsByHostId: vi.fn(),
        saveCommentByHostId: vi.fn(),
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

    const updateComment = commandUpdateComment(mockDataStore);

    const input = {
      id: "1",
      content: "Updated content",
      sessionId: "invalidSession",
    };

    await expect(updateComment(input)).rejects.toThrowError(
      "Unauthorized access",
    );
    expect(mockDataStore.comment.getCommentById).toHaveBeenCalledWith({
      id: input.id,
    });
    expect(mockDataStore.comment.updateCommentById).not.toHaveBeenCalled();
  });
});
