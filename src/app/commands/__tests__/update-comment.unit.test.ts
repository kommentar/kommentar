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
});
