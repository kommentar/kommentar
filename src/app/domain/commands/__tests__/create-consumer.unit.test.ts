import { describe, expect, it, vi } from "vitest";
import { commandCreateConsumer } from "../create-consumer/index.js";
import type { DataStore } from "../../../driven-ports/data-store.js";

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

    const createConsumer = commandCreateConsumer(mockDataStore);

    const input = {
      consumer: {
        id: "1",
        name: "Test Consumer",
        description: "This is a test consumer",
        apiKey: "test-api-key",
        apiSecret: "test-api-secret",
        allowedHosts: ["host1", "host2"],
        isActive: true,
      },
    };

    const result = await createConsumer(input);

    expect(mockDataStore.consumer.save).toHaveBeenCalledWith({
      consumer: {
        ...input.consumer,
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
