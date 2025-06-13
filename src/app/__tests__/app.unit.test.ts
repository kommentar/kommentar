import { describe, it, expect, vi, afterEach } from "vitest";
import { getApp } from "../index.js";
import type { HTTPException } from "hono/http-exception";

describe("getApp", () => {
  const mockDataStore = {
    getAllCommentsByHostId: vi.fn(),
    saveCommentByHostId: vi.fn(),
    updateCommentById: vi.fn(),
    deleteCommentById: vi.fn(),
    getCommentById: vi.fn(),
    stop: vi.fn(),
    migrateAll: vi.fn(),
    rollbackAll: vi.fn(),
  };

  const mockEventBroker = {
    publish: vi.fn(),
    subscribe: vi.fn(),
    stop: vi.fn(),
  };

  const mockRandomId = {
    generate: vi.fn(),
  };

  const mockCacheStore = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  };

  const mockProfanityClient = {
    check: vi.fn(),
    stop: vi.fn(),
  };

  const app = getApp({
    dataStore: mockDataStore,
    eventBroker: mockEventBroker,
    randomId: mockRandomId,
    cacheStore: mockCacheStore,
    profanityClient: mockProfanityClient,
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should get comments for a host", async () => {
    const hostId = "host1";
    const storedComments = [
      {
        id: "comment1",
        content: "Nice place!",
        hostid: hostId,
        sessionid: "session1",
        createdat: new Date("2021-01-01"),
        updatedat: new Date("2021-01-01"),
        commenter_displayname: "John Doe",
      },
    ];
    const comments = [
      {
        id: "comment1",
        content: "Nice place!",
        hostId: hostId,
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
        commenter: {
          displayName: "John Doe",
        },
      },
    ];

    mockDataStore.getAllCommentsByHostId.mockResolvedValue(storedComments);

    const result = await app.getCommentsForHost({ hostId });

    expect(mockDataStore.getAllCommentsByHostId).toHaveBeenCalledWith({
      hostId,
    });
    expect(result).toEqual(comments);
  });

  it("should get comments for a host from cache", async () => {
    const hostId = "host1";
    const cachedComments = [
      {
        id: "comment1",
        content: "Nice place!",
        hostId: hostId,
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
        commenter: {
          displayName: "John Doe",
        },
      },
    ];

    mockCacheStore.get.mockReturnValue(cachedComments);

    const result = await app.getCommentsForHost({ hostId });

    expect(mockDataStore.getAllCommentsByHostId).not.toHaveBeenCalled();
    expect(result).toEqual(cachedComments);
  });

  it("should create a comment for a host", async () => {
    const savedComment = {
      id: "comment1",
      content: "Nice place!",
      hostid: "host1",
      sessionid: "session1",
      createdat: new Date("2021-01-01"),
      updatedat: new Date("2021-01-01"),
      commenter_displayname: "John Doe",
    };
    const comment = {
      id: "comment1",
      content: "Nice place!",
      hostId: "host1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      commenter: {
        displayName: "John Doe",
      },
    };

    mockDataStore.saveCommentByHostId.mockResolvedValue(savedComment);

    const result = await app.createCommentForHost({
      hostId: "host1",
      content: "Nice place!",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
      },
    });

    expect(mockDataStore.saveCommentByHostId).toHaveBeenCalledWith({
      hostId: "host1",
      content: "Nice place!",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
      },
    });
    expect(result).toEqual(comment);
  });

  it("should throw an error when creating a comment with profanity", async () => {
    const hostId = "host1";
    const content = "something bad";
    mockProfanityClient.check.mockResolvedValue("PROFANE");

    try {
      await app.createCommentForHost({
        hostId,
        content,
        sessionId: "session1",
        commenter: {
          displayName: "John Doe",
        },
      });
    } catch (error) {
      const e = error as HTTPException;
      expect(e.message).toBe("Comment contains profanity");
      expect(e.status).toBe(400);
    }
  });

  it("should update a comment by id when session is valid", async () => {
    const updatedComment = {
      id: "comment1",
      content: "Updated content",
      hostid: "host1",
      sessionid: "session1",
      createdat: new Date("2021-01-01"),
      updatedat: new Date("2021-01-01"),
      commenter_displayname: "John Doe",
    };

    mockDataStore.updateCommentById.mockResolvedValue(updatedComment);
    mockDataStore.getCommentById.mockResolvedValue(updatedComment);

    const result = await app.updateCommentById({
      id: "comment1",
      content: "Updated content",
      sessionId: "session1",
    });

    expect(mockDataStore.updateCommentById).toHaveBeenCalledWith({
      id: "comment1",
      content: "Updated content",
      sessionId: "session1",
    });
    expect(result).toEqual({
      id: updatedComment.id,
      content: updatedComment.content,
      hostId: updatedComment.hostid,
      updatedAt: updatedComment.updatedat,
      createdAt: updatedComment.createdat,
      commenter: {
        displayName: updatedComment.commenter_displayname,
      },
    });
  });

  it("should throw an error when updating a comment with invalid session", async () => {
    const id = "comment1";
    const content = "Updated content";
    const sessionId = "session1";
    const updatedComment = { id, content, sessionid: sessionId };
    mockDataStore.updateCommentById.mockResolvedValue(updatedComment);
    mockDataStore.getCommentById.mockResolvedValue(updatedComment);

    try {
      await app.updateCommentById({ id, content, sessionId: "invalid" });
    } catch (error) {
      const e = error as HTTPException;
      expect(e.message).toBe("Cannot update comment");
      expect(e.status).toBe(401);
    }
  });

  it("should throw an error when updating a comment with profanity", async () => {
    const id = "comment1";
    const content = "something bad";
    const sessionId = "session1";
    mockDataStore.updateCommentById.mockResolvedValue({ id, content });
    mockProfanityClient.check.mockResolvedValue("PROFANE");

    try {
      await app.updateCommentById({ id, content, sessionId });
    } catch (error) {
      const e = error as HTTPException;
      expect(e.message).toBe("Comment contains profanity");
      expect(e.status).toBe(400);
    }
  });

  it("should delete a comment by id when session is valid", async () => {
    const savedComment = {
      id: "comment1",
      content: "Nice place!",
      hostid: "host1",
      sessionid: "session1",
      createdat: new Date("2021-01-01"),
      updatedat: new Date("2021-01-01"),
      commenter_displayname: "John Doe",
    };
    mockDataStore.saveCommentByHostId.mockResolvedValue(savedComment);
    await app.createCommentForHost({
      hostId: "host1",
      content: "Nice place!",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
      },
    });

    mockDataStore.deleteCommentById.mockResolvedValue(savedComment);
    mockDataStore.getCommentById.mockResolvedValue(savedComment);
    await app.deleteCommentById({ id: "comment1", sessionId: "session1" });

    expect(mockDataStore.deleteCommentById).toHaveBeenCalledWith({
      id: "comment1",
      sessionId: "session1",
    });
  });

  it("should throw an error when deleting a comment with invalid session", async () => {
    const id = "comment1";
    const sessionId = "session1";
    const content = "Nice place!";
    const savedComment = { id, content, sessionid: sessionId };
    mockDataStore.saveCommentByHostId.mockResolvedValue(savedComment);
    await app.createCommentForHost({
      hostId: "host1",
      content,
      sessionId,
      commenter: { displayName: "John Doe" },
    });

    try {
      mockDataStore.getCommentById.mockResolvedValue(savedComment);
      await app.deleteCommentById({ id, sessionId: "invalid" });
    } catch (error) {
      const e = error as HTTPException;
      expect(e.message).toBe("Cannot delete comment");
      expect(e.status).toBe(401);
    }
  });
});
