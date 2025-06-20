import { describe, it, expect, vi } from "vitest";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { commandCreateComment } from "../create-comment/index.js";

describe("commandCreateComment", () => {
  it("should save a comment and return it", async () => {
    const mockDataStore: DataStore = {
      comment: {
        saveCommentByHostId: vi.fn().mockResolvedValue({
          id: "1",
          content: "This is a comment",
          host_id: "host123",
          created_at: new Date("2021-01-01").toISOString(),
          updated_at: new Date("2021-01-01").toISOString(),
          session_id: "session1",
          commenter_display_name: "John Doe",
          commenter_real_name: "",
        }),
        deleteCommentById: vi.fn(),
        getAllCommentsByHostId: vi.fn(),
        updateCommentById: vi.fn(),
        getCommentById: vi.fn(),
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

    const createComment = commandCreateComment(mockDataStore);

    const input = {
      hostId: "host123",
      content: "This is a comment",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    };

    const result = await createComment(input);

    expect(mockDataStore.comment.saveCommentByHostId).toHaveBeenCalledWith(
      input,
    );
    expect(result).toEqual({
      id: "1",
      hostId: "host123",
      content: "This is a comment",
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    });
  });
});
