import { describe, it, expect, vi } from "vitest";
import type { DataStore } from "../../driven-ports/data-store.js";
import { commandCreateComment } from "../create-comment/index.js";

describe("commandCreateComment", () => {
  it("should save a comment and return it", async () => {
    const mockDataStore: DataStore = {
      saveCommentByHostId: vi.fn().mockResolvedValue({
        id: "1",
        content: "This is a comment",
        hostid: "host123",
        createdat: new Date("2021-01-01").toISOString(),
        updatedat: new Date("2021-01-01").toISOString(),
        sessionid: "session1",
        commenter_displayname: "John Doe",
      }),
      deleteCommentById: vi.fn(),
      getAllCommentsByHostId: vi.fn(),
      updateCommentById: vi.fn(),
      getCommentById: vi.fn(),
    };

    const createComment = commandCreateComment(mockDataStore);

    const input = {
      hostId: "host123",
      content: "This is a comment",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
      },
    };

    const result = await createComment(input);

    expect(mockDataStore.saveCommentByHostId).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: "1",
      hostId: "host123",
      content: "This is a comment",
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
      commenter: {
        displayName: "John Doe",
      },
    });
  });
});
