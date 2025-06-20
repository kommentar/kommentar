import { type Mock, describe, expect, it, vi } from "vitest";
import type { CacheStore } from "../../../driven-ports/cache-store.js";
import type { Comment } from "../../entities/comment.js";
import type { EventBroker } from "../../../driven-ports/event-broker.js";
import { wheneverCommentUpdatedInvalidateCache } from "../whenever-comment-updated-invalidate-cache.js";

describe("wheneverCommentUpdatedInvalidateCache", () => {
  it("should add the updated comment to the cache when there are no cached comments", () => {
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

    wheneverCommentUpdatedInvalidateCache({
      eventBroker: mockEventBroker,
      cacheStore: mockCacheStore,
    });

    const eventHandler = (mockEventBroker.subscribe as Mock).mock.calls[0][0]
      .handler;
    const updatedComment: Comment = {
      id: "1",
      content: "Updated comment",
      hostId: "1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 1",
        realName: "Real Name 1",
      },
    };
    const event = { subject: "comment-1", data: updatedComment };

    eventHandler(event);

    expect(mockCacheStore.set).toHaveBeenCalledWith("1", [updatedComment]);
  });

  it("should update the existing cached comment", () => {
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

    wheneverCommentUpdatedInvalidateCache({
      eventBroker: mockEventBroker,
      cacheStore: mockCacheStore,
    });

    const eventHandler = (mockEventBroker.subscribe as Mock).mock.calls[0][0]
      .handler;
    const updatedComment: Comment = {
      id: "1",
      content: "Updated comment",
      hostId: "1",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 1",
        realName: "Real Name 1",
      },
    };
    const event = { subject: "comment-1", data: updatedComment };

    eventHandler(event);

    expect(mockCacheStore.set).toHaveBeenCalledWith("1", [
      updatedComment,
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
