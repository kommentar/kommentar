import { describe, expect, it, vi } from "vitest";
import type { DataStore } from "../../driven-ports/data-store.js";
import { queryGetCommentsForHost } from "../get-comments-for-host/index.js";

describe("queryGetCommentsForHost", () => {
  it("should return an empty array when there are no comments for the given host ID", async () => {
    const mockDataStore: DataStore = {
      getAllCommentsByHostId: vi.fn().mockResolvedValue([]),
      deleteCommentById: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
      getCommentById: vi.fn(),
    };

    const getCommentsForHost = queryGetCommentsForHost(mockDataStore);
    const comments = await getCommentsForHost({ hostId: "1" });

    expect(comments).toEqual([]);
    expect(mockDataStore.getAllCommentsByHostId).toHaveBeenCalledWith({
      hostId: "1",
    });
  });

  it("should return an array of comments for the given host ID", async () => {
    const savedComments = [
      {
        id: "1",
        content: "First comment",
        hostid: "1",
        createdat: new Date("2021-01-01"),
        updatedat: new Date("2021-01-01"),
        commenter_displayname: "John Doe",
      },
      {
        id: "2",
        content: "Second comment",
        hostid: "1",
        createdat: new Date("2021-01-02"),
        updatedat: new Date("2021-01-02"),
        commenter_displayname: "Jane Doe",
      },
    ];

    const mockDataStore: DataStore = {
      getAllCommentsByHostId: vi.fn().mockResolvedValue(savedComments),
      deleteCommentById: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
      getCommentById: vi.fn(),
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
        },
      },
    ]);
    expect(mockDataStore.getAllCommentsByHostId).toHaveBeenCalledWith({
      hostId: "1",
    });
  });
});
