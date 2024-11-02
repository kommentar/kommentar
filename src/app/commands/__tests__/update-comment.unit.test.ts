import { describe, it, expect, vi } from "vitest";
import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../../driven-ports/data-store.js";
import { commandUpdateComment } from "../update-comment/index.js";

describe("commandUpdateComment", () => {
  it("should update a comment and return it", async () => {
    const mockDataStore: DataStore = {
      updateCommentById: vi.fn().mockResolvedValue({
        id: "1",
        content: "Updated content",
      } as Comment),
      getCommentById: vi.fn().mockResolvedValue({
        id: "1",
        content: "Test comment",
        hostId: "host1",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Comment),
      deleteCommentById: vi.fn(),
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
    };

    const updateComment = commandUpdateComment(mockDataStore);

    const input = {
      id: "1",
      content: "Updated content",
    };

    const result = await updateComment(input);

    expect(mockDataStore.updateCommentById).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: "1",
      content: "Updated content",
    });
  });

  it("should throw an error if the comment does not exist", async () => {
    const mockDataStore: DataStore = {
      updateCommentById: vi.fn(),
      getCommentById: vi.fn().mockResolvedValue(null),
      deleteCommentById: vi.fn(),
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
    };

    const updateComment = commandUpdateComment(mockDataStore);

    const input = {
      id: "1",
      content: "Updated content",
    };

    await expect(updateComment(input)).rejects.toThrowError(
      "Comment not found",
    );
    expect(mockDataStore.getCommentById).toHaveBeenCalledWith({ id: input.id });
    expect(mockDataStore.updateCommentById).not.toHaveBeenCalled();
  });
});
