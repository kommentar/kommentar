import { describe, it, expect, vi } from "vitest";
import type { DataStore } from "../../driven-ports/data-store.js";
import type { Comment } from "../../domain/entities/comment.js";
import { commandCreateComment } from "../create-comment/index.js";

describe("commandCreateComment", () => {
  it("should save a comment and return it", async () => {
    const mockDataStore: DataStore = {
      saveCommentByHostId: vi.fn().mockResolvedValue({
        id: "1",
        content: "This is a comment",
        hostId: "host123",
      } as Comment),
      deleteCommentById: vi.fn(),
      getAllCommentsByHostId: vi.fn(),
      updateCommentById: vi.fn(),
    };

    const createComment = commandCreateComment(mockDataStore);

    const input = {
      hostId: "host123",
      content: "This is a comment",
    };

    const result = await createComment(input);

    expect(mockDataStore.saveCommentByHostId).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: "1",
      hostId: "host123",
      content: "This is a comment",
    });
  });
});
