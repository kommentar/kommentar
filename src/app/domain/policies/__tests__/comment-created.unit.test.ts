import { describe, it, expect, vi, type Mock } from "vitest";
import type { EventBroker } from "../../../driven-ports/event-broker.js";
import type { CacheStore } from "../../../driven-ports/cache-store.js";
import { wheneverCommentCreatedInvalidateCache } from "../whenever-comment-created-invalidate-cache.js";
import type { Comment } from "../../entities/comment.js";

describe("wheneverCommentCreatedInvalidateCache", () => {
  it("should add a new comment to the cache when there are no cached comments", () => {
    const mockEventBroker: EventBroker = {
      subscribe: vi.fn(),
      publish: vi.fn(),
      stop: vi.fn(),
    };
    const mockCacheStore: CacheStore = {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
      clear: vi.fn(),
      remove: vi.fn(),
    };

    wheneverCommentCreatedInvalidateCache({
      eventBroker: mockEventBroker,
      cacheStore: mockCacheStore,
    });

    const eventHandler = (mockEventBroker.subscribe as Mock).mock.calls[0][0]
      .handler;
    const newComment: Comment = {
      id: "1",
      content: "New comment",
      hostId: "1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 1",
      },
    };
    const event = { subject: "comment-1", data: newComment };

    eventHandler(event);

    expect(mockCacheStore.set).toHaveBeenCalledWith("comment-1", [newComment]);
  });

  it("should add a new comment to the existing cached comments", () => {
    const existingComments: Comment[] = [
      {
        id: "1",
        content: "Existing comment",
        hostId: "1",
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
        sessionId: "session1",
        commenter: {
          displayName: "Commenter 1",
        },
      },
    ];

    const mockEventBroker: EventBroker = {
      subscribe: vi.fn(),
      publish: vi.fn(),
      stop: vi.fn(),
    };
    const mockCacheStore: CacheStore = {
      get: vi.fn().mockReturnValue(existingComments),
      set: vi.fn(),
      clear: vi.fn(),
      remove: vi.fn(),
    };

    wheneverCommentCreatedInvalidateCache({
      eventBroker: mockEventBroker,
      cacheStore: mockCacheStore,
    });

    const eventHandler = (mockEventBroker.subscribe as Mock).mock.calls[0][0]
      .handler;
    const newComment: Comment = {
      id: "2",
      content: "New comment",
      hostId: "1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 2",
      },
    };
    const event = { subject: "comment-1", data: newComment };

    eventHandler(event);

    expect(mockCacheStore.set).toHaveBeenCalledWith("comment-1", [
      ...existingComments,
      newComment,
    ]);
  });
});
