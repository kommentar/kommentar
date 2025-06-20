import { describe, expect, it, vi } from "vitest";
import type { DataStore } from "../../../driven-ports/data-store.js";
import { commandUpdateConsumer } from "../update-consumer/index.js";

describe("commandUpdateConsumer", () => {
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
        save: vi.fn(),
        getById: vi.fn().mockResolvedValue({
          id: "1",
          name: "Test Consumer",
          description: "This is a test consumer",
        }),
        getAll: vi.fn(),
        getByApiKey: vi.fn(),
        deleteById: vi.fn(),
        update: vi.fn().mockResolvedValue({
          id: "1",
          name: "Test Consumer Updated",
          description: "This is a test consumer updated",
          api_key: "c5334937-d951-4885-af08-46b4a63c5f6d",
          api_secret: "2f5c79d8-04bd-4988-9649-3f3cd0687de3",
          allowed_hosts: JSON.stringify([]),
          is_active: true,
          rate_limit: 100,
          created_at: new Date("2023-01-01T00:00:00Z"),
          updated_at: new Date("2023-01-01T00:00:00Z"),
        }),
      },
      stop: vi.fn(),
      migrateAll: vi.fn(),
      rollbackAll: vi.fn(),
    };

    const createConsumer = commandUpdateConsumer(mockDataStore);

    const input = {
      consumer: {
        id: "1",
        name: "Test Consumer Updated",
        description: "This is a test consumer updated",
        apiKey: "c5334937-d951-4885-af08-46b4a63c5f6d",
        apiSecret: "2f5c79d8-04bd-4988-9649-3f3cd0687de3",
        isActive: true,
        allowedHosts: [],
        rateLimit: 100,
      },
    };

    const result = await createConsumer(input);

    expect(mockDataStore.consumer.update).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: "1",
      name: "Test Consumer Updated",
      description: "This is a test consumer updated",
      apiKey: "c5334937-d951-4885-af08-46b4a63c5f6d",
      allowedHosts: [],
      isActive: true,
      rateLimit: 100,
    });
  });
});
