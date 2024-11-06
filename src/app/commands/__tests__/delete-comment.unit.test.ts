import { describe, it, expect, vi } from "vitest";
import type { DataStore } from "../../driven-ports/data-store.js";
import type { Comment } from "../../domain/entities/comment.js";
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
      },
    };

    const mockDataStore: DataStore = {
      deleteCommentById: vi.fn().mockResolvedValue({
        id: mockComment.id,
        content: mockComment.content,
        hostid: mockComment.hostId,
        createdat: mockComment.createdAt,
        updatedat: mockComment.updatedAt,
        sessionid: mockComment.sessionId,
        commenter_displayname: mockComment.commenter.displayName,
      }),
      getCommentById: vi.fn().mockResolvedValue({
        id: mockComment.id,
        content: mockComment.content,
        hostid: mockComment.hostId,
        createdat: mockComment.createdAt,
        updatedat: mockComment.updatedAt,
        sessionid: mockComment.sessionId,
        commenter_displayname: mockComment.commenter.displayName,
      }),
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
      stop: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
      sessionId: "session1",
    };

    const result = await deleteComment(input);

    expect(mockDataStore.deleteCommentById).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockComment);
  });

  it("should throw an error if the comment does not exist", async () => {
    const mockDataStore: DataStore = {
      deleteCommentById: vi.fn(),
      getCommentById: vi.fn().mockResolvedValue(undefined),
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
      stop: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
      sessionId: "session1",
    };

    await expect(deleteComment(input)).rejects.toThrowError(
      "Comment not found",
    );
    expect(mockDataStore.getCommentById).toHaveBeenCalledWith({ id: input.id });
    expect(mockDataStore.deleteCommentById).not.toHaveBeenCalled();
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
      },
    };

    const mockDataStore: DataStore = {
      deleteCommentById: vi.fn(),
      getCommentById: vi.fn().mockResolvedValue(mockComment),
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
      stop: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
      sessionId: "session2",
    };

    await expect(deleteComment(input)).rejects.toThrowError(
      "Cannot delete comment",
    );
    expect(mockDataStore.getCommentById).toHaveBeenCalledWith({ id: input.id });
    expect(mockDataStore.deleteCommentById).not.toHaveBeenCalled();
  });
});
