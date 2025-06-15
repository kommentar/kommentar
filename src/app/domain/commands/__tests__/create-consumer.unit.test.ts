import { describe, expect, it, vi } from "vitest";
import { commandCreateConsumer } from "../create-consumer/index.js";
import type { DataStore } from "../../../driven-ports/data-store.js";

describe("commandCreateConsumer", () => {
  it("should save a consumer and return it", async () => {
    const mockDataStore: DataStore = {
      getCommentById: vi.fn(),
      getAllCommentsByHostId: vi.fn(),
      deleteCommentById: vi.fn(),
      updateCommentById: vi.fn(),
      saveCommentByHostId: vi.fn(),
      consumer: {
        save: vi.fn().mockResolvedValue({
          id: "1",
          name: "Test Consumer",
          description: "This is a test consumer",
        }),
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
      },
    };

    const result = await createConsumer(input);

    expect(mockDataStore.consumer.save).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: "1",
      name: "Test Consumer",
      description: "This is a test consumer",
    });
  });
});
