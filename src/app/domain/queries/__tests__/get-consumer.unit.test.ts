import { describe, expect, it, vi } from "vitest";
import type {
  DataStore,
  StoredConsumer,
} from "../../../driven-ports/data-store.js";
import { queryGetConsumer } from "../get-consumer/index.js";

describe("queryGetConsumer", () => {
  it("should return undefined when there is no consumer with the given id", async () => {
    const mockDataStore: DataStore = {
      comment: {
        getAllCommentsByHostId: vi.fn(),
        deleteCommentById: vi.fn(),
        saveCommentByHostId: vi.fn(),
        updateCommentById: vi.fn(),
        getCommentById: vi.fn(),
      },
      consumer: {
        save: vi.fn(),
        getById: vi.fn().mockResolvedValue(undefined),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const getCommentsForHost = queryGetConsumer(mockDataStore);
    const comments = await getCommentsForHost({ id: "1" });

    expect(comments).toEqual(undefined);
    expect(mockDataStore.consumer.getById).toHaveBeenCalledWith({
      consumerId: "1",
    });
  });

  it("should return a consumer", async () => {
    const savedConsumer: StoredConsumer = {
      id: "1",
      name: "Test Consumer",
      description: "This is a test consumer",
      api_key: "f2ef9606-6e10-4530-a15c-594c2e3fcd73",
      api_secret: "b5fe46d6-1efe-4988-bf2b-d5b0a90fbaaf",
      is_active: true,
      rate_limit: 100,
      allowed_hosts: JSON.stringify(["host1", "host2"]),
      created_at: new Date("2021-01-01"),
      updated_at: new Date("2021-01-01"),
    };

    const mockDataStore: DataStore = {
      comment: {
        getAllCommentsByHostId: vi.fn(),
        deleteCommentById: vi.fn(),
        saveCommentByHostId: vi.fn(),
        updateCommentById: vi.fn(),
        getCommentById: vi.fn(),
      },
      consumer: {
        save: vi.fn(),
        getById: vi.fn().mockResolvedValue(savedConsumer),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const getConsumer = queryGetConsumer(mockDataStore);
    const consumer = await getConsumer({ id: "1" });

    expect(consumer).toEqual(
      expect.objectContaining({
        id: "1",
        name: "Test Consumer",
        description: "This is a test consumer",
      }),
    );
    expect(mockDataStore.consumer.getById).toHaveBeenCalledWith({
      consumerId: "1",
    });
  });
});
