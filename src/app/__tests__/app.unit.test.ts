import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomError } from "../domain/entities/error.js";
import { getApp } from "../index.js";

describe("getApp", () => {
  const mockDataStore = {
    comment: {
      getAllCommentsByHostId: vi.fn(),
      saveCommentByHostId: vi.fn(),
      updateCommentById: vi.fn(),
      deleteCommentById: vi.fn(),
      getCommentById: vi.fn(),
    },
    consumer: {
      getAll: vi.fn(),
      getById: vi.fn(),
      getByApiKey: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      deleteById: vi.fn(),
      getCount: vi.fn(),
    },
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
        host_id: hostId,
        session_id: "session1",
        created_at: new Date("2021-01-01"),
        updated_at: new Date("2021-01-01"),
        commenter_display_name: "John Doe",
        commenter_real_name: "",
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
          realName: "",
        },
      },
    ];

    mockDataStore.comment.getAllCommentsByHostId.mockResolvedValue(
      storedComments,
    );

    const result = await app.comment.getCommentsForHost({ hostId });

    expect(mockDataStore.comment.getAllCommentsByHostId).toHaveBeenCalledWith({
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

    const result = await app.comment.getCommentsForHost({ hostId });

    expect(mockDataStore.comment.getAllCommentsByHostId).not.toHaveBeenCalled();
    expect(result).toEqual(cachedComments);
  });

  it("should create a comment for a host", async () => {
    const savedComment = {
      id: "comment1",
      content: "Nice place!",
      host_id: "host1",
      session_id: "session1",
      created_at: new Date("2021-01-01"),
      updated_at: new Date("2021-01-01"),
      commenter_display_name: "John Doe",
      commenter_real_name: "",
    };
    const comment = {
      id: "comment1",
      content: "Nice place!",
      hostId: "host1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    };

    mockDataStore.comment.saveCommentByHostId.mockResolvedValue(savedComment);

    const result = await app.comment.createCommentForHost({
      hostId: "host1",
      content: "Nice place!",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    });

    expect(mockDataStore.comment.saveCommentByHostId).toHaveBeenCalledWith({
      hostId: "host1",
      content: "Nice place!",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    });
    expect(result).toEqual(comment);
  });

  it("should throw an error when creating a comment with profanity", async () => {
    const hostId = "host1";
    const content = "something bad";
    mockProfanityClient.check.mockResolvedValue("PROFANE");

    try {
      await app.comment.createCommentForHost({
        hostId,
        content,
        sessionId: "session1",
        commenter: {
          displayName: "John Doe",
          realName: "",
        },
      });
    } catch (error) {
      const e = error as CustomError;
      expect(e.message).toBe(
        "Comment contains profane content. Please revise your comment.",
      );
      expect(e.type).toBe("PROFANE_COMMENT");
      expect(e.code).toBe("InvalidInput");
    }
  });

  it("should update a comment by id when session is valid", async () => {
    const updatedComment = {
      id: "comment1",
      content: "Updated content",
      host_id: "host1",
      session_id: "session1",
      created_at: new Date("2021-01-01"),
      updated_at: new Date("2021-01-01"),
      commenter_display_name: "John Doe",
      commenter_real_name: "",
    };

    mockDataStore.comment.updateCommentById.mockResolvedValue(updatedComment);
    mockDataStore.comment.getCommentById.mockResolvedValue(updatedComment);

    const result = await app.comment.updateCommentById({
      id: "comment1",
      content: "Updated content",
      sessionId: "session1",
    });

    expect(mockDataStore.comment.updateCommentById).toHaveBeenCalledWith({
      id: "comment1",
      content: "Updated content",
      sessionId: "session1",
    });
    expect(result).toEqual({
      id: updatedComment.id,
      content: updatedComment.content,
      hostId: updatedComment.host_id,
      updatedAt: updatedComment.updated_at,
      createdAt: updatedComment.created_at,
      commenter: {
        displayName: updatedComment.commenter_display_name,
        realName: updatedComment.commenter_real_name,
      },
    });
  });

  it("should throw an error when updating a comment with invalid session", async () => {
    const id = "comment1";
    const content = "Updated content";
    const sessionId = "session1";
    const updatedComment = { id, content, sessionid: sessionId };
    mockDataStore.comment.updateCommentById.mockResolvedValue(updatedComment);
    mockDataStore.comment.getCommentById.mockResolvedValue(updatedComment);

    try {
      await app.comment.updateCommentById({
        id,
        content,
        sessionId: "invalid",
      });
    } catch (error) {
      const e = error as CustomError;
      expect(e.message).toBe("Unauthorized access");
      expect(e.type).toBe("UNAUTHORIZED");
      expect(e.code).toBe("Unauthorized");
    }
  });

  it.todo(
    "should throw an error when updating a comment with profanity",
    async () => {
      const id = "comment1";
      const content = "something bad";
      const sessionId = "session1";
      mockDataStore.comment.updateCommentById.mockResolvedValue({
        id,
        content,
      });
      mockProfanityClient.check.mockResolvedValue("PROFANE");

      try {
        await app.comment.updateCommentById({ id, content, sessionId });
      } catch (error) {
        const e = error as CustomError;
        expect(e.message).toBe(
          "Comment contains profane content. Please revise your comment.",
        );
        expect(e.type).toBe("PROFANE_COMMENT");
        expect(e.code).toBe("InvalidInput");
      }
    },
  );

  it("should delete a comment by id when session is valid", async () => {
    const savedComment = {
      id: "comment1",
      content: "Nice place!",
      host_id: "host1",
      session_id: "session1",
      created_at: new Date("2021-01-01"),
      updated_at: new Date("2021-01-01"),
      commenter_display_name: "John Doe",
      commenter_real_name: "",
    };
    mockDataStore.comment.saveCommentByHostId.mockResolvedValue(savedComment);
    await app.comment.createCommentForHost({
      hostId: "host1",
      content: "Nice place!",
      sessionId: "session1",
      commenter: {
        displayName: "John Doe",
        realName: "",
      },
    });

    mockDataStore.comment.deleteCommentById.mockResolvedValue(savedComment);
    mockDataStore.comment.getCommentById.mockResolvedValue(savedComment);
    await app.comment.deleteCommentById({
      id: "comment1",
      sessionId: "session1",
    });

    expect(mockDataStore.comment.deleteCommentById).toHaveBeenCalledWith({
      id: "comment1",
      sessionId: "session1",
    });
  });

  it("should throw an error when deleting a comment with invalid session", async () => {
    const id = "comment1";
    const sessionId = "session1";
    const content = "Nice place!";
    const savedComment = { id, content, sessionid: sessionId };
    mockDataStore.comment.saveCommentByHostId.mockResolvedValue(savedComment);
    await app.comment.createCommentForHost({
      hostId: "host1",
      content,
      sessionId,
      commenter: { displayName: "John Doe", realName: "" },
    });

    try {
      mockDataStore.comment.getCommentById.mockResolvedValue(savedComment);
      await app.comment.deleteCommentById({ id, sessionId: "invalid" });
    } catch (error) {
      const e = error as CustomError;
      expect(e.message).toBe("Unauthorized access");
      expect(e.type).toBe("UNAUTHORIZED");
      expect(e.code).toBe("Unauthorized");
    }
  });
});
