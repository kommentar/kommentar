import { describe, expect, it, vi } from "vitest";
import { commandDeleteConsumer } from "../delete-consumer/index.js";
import type { DataStore } from "../../../driven-ports/data-store.js";

describe("commandDeleteConsumer", () => {
  it("should save a consumer and return it", async () => {
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
        }),
        update: vi.fn(),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const createConsumer = commandDeleteConsumer(mockDataStore);

    const input = { id: "1" };

    const result = await createConsumer(input);

    expect(mockDataStore.consumer.deleteById).toHaveBeenCalledWith({
      consumerId: "1",
    });
    expect(result).toEqual({
      id: "1",
      name: "Test Consumer",
      description: "This is a test consumer",
    });
  });
});
