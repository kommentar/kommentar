import { describe, it, expect, vi, type Mock } from "vitest";
import type { EventBroker } from "../../../driven-ports/event-broker.js";
import type { CacheStore } from "../../../driven-ports/cache-store.js";
import { wheneverCommentDeletedInvalidateCache } from "../whenever-comment-deleted-invalidate-cache.js";
import type { Comment } from "../../entities/comment.js";

describe("wheneverCommentDeletedInvalidateCache", () => {
  it("should do nothing when there are no cached comments", () => {
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

    wheneverCommentDeletedInvalidateCache({
      eventBroker: mockEventBroker,
      cacheStore: mockCacheStore,
    });

    const eventHandler = (mockEventBroker.subscribe as Mock).mock.calls[0][0]
      .handler;
    const deletedComment: Comment = {
      id: "1",
      content: "Deleted comment",
      hostId: "1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 1",
        realName: "Real Name 1",
      },
    };
    const event = { subject: "comment-1", data: deletedComment };

    eventHandler(event);

    expect(mockCacheStore.set).not.toHaveBeenCalled();
  });

  it("should remove the deleted comment from the existing cached comments", () => {
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
          realName: "Real Name 1",
        },
      },
      {
        id: "2",
        content: "Another comment",
        hostId: "1",
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
        sessionId: "session1",
        commenter: {
          displayName: "Commenter 2",
          realName: "Real Name 2",
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

    wheneverCommentDeletedInvalidateCache({
      eventBroker: mockEventBroker,
      cacheStore: mockCacheStore,
    });

    const eventHandler = (mockEventBroker.subscribe as Mock).mock.calls[0][0]
      .handler;
    const deletedComment: Comment = {
      id: "1",
      content: "Deleted comment",
      hostId: "1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 1",
        realName: "Real Name 1",
      },
    };
    const event = { subject: "comment-1", data: deletedComment };

    eventHandler(event);

    expect(mockCacheStore.set).toHaveBeenCalledWith("1", [
      {
        id: "2",
        content: "Another comment",
        hostId: "1",
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
        sessionId: "session1",
        commenter: {
          displayName: "Commenter 2",
          realName: "Real Name 2",
        },
      },
    ]);
  });
});
