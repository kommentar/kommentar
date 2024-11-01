import { describe, it, expect, vi } from "vitest";
import type { DataStore } from "../../driven-ports/data-store.js";
import { commandDeleteComment } from "../delete-comment/index.js";
import type { Comment } from "../../domain/entities/comment.js";

describe("commandDeleteComment", () => {
  it("should delete a comment by id", async () => {
    const mockComment: Comment = {
      id: "1",
      content: "Test comment",
      hostId: "host1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockDataStore: DataStore = {
      deleteCommentById: vi.fn().mockResolvedValue({
        id: mockComment.id,
        content: mockComment.content,
        hostid: mockComment.hostId,
        createdat: mockComment.createdAt,
        updatedat: mockComment.updatedAt,
      }),
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
    };

    const result = await deleteComment(input);

    expect(mockDataStore.deleteCommentById).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockComment);
  });
});
