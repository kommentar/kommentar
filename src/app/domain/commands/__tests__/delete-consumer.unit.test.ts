import { describe, expect, it, vi } from "vitest";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { commandDeleteConsumer } from "../delete-consumer/index.js";

describe("commandDeleteConsumer", () => {
  it("should save a consumer and return it", async () => {
    const date = new Date();

    const mockDataStore: DataStore = {
      comment: {
        getCommentById: vi.fn(),
        getAllCommentsByHostId: vi.fn(),
        deleteCommentById: vi.fn(),
        updateCommentById: vi.fn(),
        saveCommentByHostId: vi.fn(),
      },
      consumer: {
        save: vi.fn(),
        getById: vi.fn().mockResolvedValue({
          id: "1",
          name: "Test Consumer",
          description: "This is a test consumer",
        }),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn().mockResolvedValue({
          id: "1",
          name: "Test Consumer",
          description: "This is a test consumer",
          api_key: "c59b8f26-9f3c-42db-abf3-f265b612a2b9",
          api_secret: "secret",
          allowed_hosts: null,
          is_active: true,
          rate_limit: 200,
          created_at: date,
          updated_at: date,
        }),
        update: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const deleteConsumer = commandDeleteConsumer(mockDataStore);

    const input = { id: "1" };

    const result = await deleteConsumer(input);

    expect(mockDataStore.consumer.deleteById).toHaveBeenCalledWith({
      consumerId: "1",
    });
    expect(result).toEqual({
      id: "1",
      name: "Test Consumer",
      description: "This is a test consumer",
      apiKey: "c59b8f26-9f3c-42db-abf3-f265b612a2b9",
      isActive: true,
      rateLimit: 200,
    });
  });
});
