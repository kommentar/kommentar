import { describe, it, expect, vi } from "vitest";
import type { DataStore } from "../../driven-ports/data-store.js";
import { commandDeleteComment } from "../delete-comment/index.js";

describe("commandDeleteComment", () => {
  it("should delete a comment by id", async () => {
    const mockDataStore: DataStore = {
      deleteCommentById: vi.fn().mockResolvedValue(undefined),
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
    };

    const deleteComment = commandDeleteComment(mockDataStore);

    const input = {
      id: "1",
    };

    await deleteComment(input);

    expect(mockDataStore.deleteCommentById).toHaveBeenCalledWith(input);
  });
});
