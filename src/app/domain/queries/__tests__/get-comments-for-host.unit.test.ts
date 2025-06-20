import { describe, expect, it, vi } from "vitest";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { queryGetCommentsForHost } from "../get-comments-for-host/index.js";

describe("queryGetCommentsForHost", () => {
  it("should return an empty array when there are no comments for the given host ID", async () => {
    const mockDataStore: DataStore = {
      comment: {
        getAllCommentsByHostId: vi.fn().mockResolvedValue([]),
        deleteCommentById: vi.fn(),
        saveCommentByHostId: vi.fn(),
        updateCommentById: vi.fn(),
        getCommentById: vi.fn(),
      },
      consumer: {
        save: vi.fn(),
        getById: vi.fn(),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const getCommentsForHost = queryGetCommentsForHost(mockDataStore);
    const comments = await getCommentsForHost({ hostId: "1" });

    expect(comments).toEqual([]);
    expect(mockDataStore.comment.getAllCommentsByHostId).toHaveBeenCalledWith({
      hostId: "1",
    });
  });

  it("should return an array of comments for the given host ID", async () => {
    const savedComments = [
      {
        id: "1",
        content: "First comment",
        host_id: "1",
        created_at: new Date("2021-01-01"),
        updated_at: new Date("2021-01-01"),
        commenter_display_name: "John Doe",
        commenter_real_name: "",
      },
      {
        id: "2",
        content: "Second comment",
        host_id: "1",
        created_at: new Date("2021-01-02"),
        updated_at: new Date("2021-01-02"),
        commenter_display_name: "Jane Doe",
        commenter_real_name: "",
      },
    ];

    const mockDataStore: DataStore = {
      comment: {
        getAllCommentsByHostId: vi.fn().mockResolvedValue(savedComments),
        deleteCommentById: vi.fn(),
        saveCommentByHostId: vi.fn(),
        updateCommentById: vi.fn(),
        getCommentById: vi.fn(),
      },
      consumer: {
        save: vi.fn(),
        getById: vi.fn(),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const getCommentsForHost = queryGetCommentsForHost(mockDataStore);
    const comments = await getCommentsForHost({ hostId: "1" });

    expect(comments).toEqual([
      {
        id: "1",
        content: "First comment",
        hostId: "1",
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
        commenter: {
          displayName: "John Doe",
          realName: "",
        },
      },
      {
        id: "2",
        content: "Second comment",
        hostId: "1",
        createdAt: new Date("2021-01-02"),
        updatedAt: new Date("2021-01-02"),
        commenter: {
          displayName: "Jane Doe",
          realName: "",
        },
      },
    ]);
    expect(mockDataStore.comment.getAllCommentsByHostId).toHaveBeenCalledWith({
      hostId: "1",
    });
  });
});
