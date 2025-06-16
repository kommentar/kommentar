import { describe, expect, it, vi } from "vitest";
import { commandDeleteConsumer } from "../delete-consumer/index.js";
import type { DataStore } from "../../../driven-ports/data-store.js";

describe("commandDeleteConsumer", () => {
  it("should save a consumer and return it", async () => {
    const date = new Date();

    const mockDataStore: DataStore = {
      getCommentById: vi.fn(),
      getAllCommentsByHostId: vi.fn(),
      deleteCommentById: vi.fn(),
      updateCommentById: vi.fn(),
      saveCommentByHostId: vi.fn(),
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
          apikey: "c59b8f26-9f3c-42db-abf3-f265b612a2b9",
          apisecret: "secret",
          allowedhosts: null,
          isactive: true,
          ratelimit: 200,
          createdat: date,
          updatedat: date,
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
      apiSecret: "secret",
      allowedHosts: [],
      isActive: true,
      rateLimit: 200,
      createdAt: date,
      updatedAt: date,
    });
  });
});
