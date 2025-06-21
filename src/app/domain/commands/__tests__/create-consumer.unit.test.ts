import { describe, expect, it, vi } from "vitest";
import type { DataStore } from "../../../driven-ports/data-store.js";
import type { RandomId } from "../../../driven-ports/random-id.js";
import { commandCreateConsumer } from "../create-consumer/index.js";

describe("commandCreateConsumer", () => {
  it("should save a consumer and return it", async () => {
    const mockDataStore: DataStore = {
      comment: {
        getCommentById: vi.fn(),
        getAllCommentsByHostId: vi.fn(),
        deleteCommentById: vi.fn(),
        updateCommentById: vi.fn(),
        saveCommentByHostId: vi.fn(),
      },
      consumer: {
        save: vi.fn().mockResolvedValue({
          id: "1",
          name: "Test Consumer",
          description: "This is a test consumer",
          apiKey: "test-api-key",
          apiSecret: "test-api-secret",
          allowedHosts: JSON.stringify(["host1", "host2"]),
          isActive: true,
        }),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        getById: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const mockRandomId: RandomId = {
      generate: vi.fn().mockReturnValue("test-random-id"),
    };

    const createConsumer = commandCreateConsumer(mockDataStore, mockRandomId);

    const input = {
      consumer: {
        id: "TEMPORARY_ID",
        name: "Test Consumer",
        description: "This is a test consumer",
        apiKey: "TEMPORARY_API_KEY",
        apiSecret: "TEMPORARY_API_SECRET",
        allowedHosts: ["host1", "host2"],
        isActive: true,
        rateLimit: 100,
      },
    };

    const result = await createConsumer(input);

    expect(mockDataStore.consumer.save).toHaveBeenCalledWith({
      consumer: {
        ...input.consumer,
        id: expect.any(String),
        apiKey: expect.any(String),
        apiSecret: expect.any(String), // Should be hashed in the actual implementation
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: "1",
        name: "Test Consumer",
        description: "This is a test consumer",
      }),
    );
  });
});
