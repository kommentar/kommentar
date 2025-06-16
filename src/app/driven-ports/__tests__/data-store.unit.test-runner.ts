import { beforeAll, describe, expect, it } from "vitest";
import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../data-store.js";
import type { Consumer } from "../../domain/entities/consumer.js";

const mockComments: Comment[] = [
  {
    id: "1",
    hostId: "host1",
    content: "First comment",
    createdAt: new Date(),
    updatedAt: new Date(),
    sessionId: "session1",
    commenter: {
      displayName: "Commenter 1",
    },
  },
  {
    id: "2",
    hostId: "host1",
    content: "Second comment",
    createdAt: new Date(),
    updatedAt: new Date(),
    sessionId: "session1",
    commenter: {
      displayName: "Commenter 2",
    },
  },
];

const mockComment = {
  id: "3",
  hostId: "host2",
  content: "New comment",
};

const runDataStoreTests = (dataStore: DataStore) => {
  beforeAll(async () => {
    await dataStore.saveCommentByHostId({
      hostId: "host1",
      content: "First comment",
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 1",
      },
    });

    await dataStore.saveCommentByHostId({
      hostId: "host1",
      content: "Second comment",
      sessionId: "session1",
      commenter: {
        displayName: "Commenter 2",
      },
    });
  });

  describe("DataStore Port Tests", () => {
    it("should get all comments by host identifier", async () => {
      const comments = await dataStore.getAllCommentsByHostId({
        hostId: "host1",
      });

      comments.map((comment, index) => {
        expect(comment.id).toBeTypeOf("string");
        expect(comment.hostid).toBe(mockComments[index].hostId);
        expect(comment.content).toBe(mockComments[index].content);
      });
    });

    it("should save a new comment by host identifier", async () => {
      const savedComment = await dataStore.saveCommentByHostId({
        hostId: "host2",
        content: "New comment",
        sessionId: "session1",
        commenter: {
          displayName: "Commenter 3",
        },
      });

      expect(savedComment.id).toBeTypeOf("string");
      expect(savedComment.hostid).toBe(mockComment.hostId);
      expect(savedComment.content).toBe(mockComment.content);
    });

    it("should update a comment by identifier", async () => {
      const commentToUpdate = await dataStore.saveCommentByHostId({
        hostId: "host2",
        content: "New comment to update",
        sessionId: "session1",
        commenter: {
          displayName: "Commenter 4",
        },
      });

      const updatedComment = await dataStore.updateCommentById({
        id: commentToUpdate.id,
        content: "Updated comment",
        sessionId: "session1",
      });

      expect(updatedComment.id).toBe(commentToUpdate.id);
      expect(updatedComment.hostid).toBe(commentToUpdate.hostid);
      expect(updatedComment.content).toBe("Updated comment");
    });

    it("should delete a comment by identifier", async () => {
      const commentToDelete = await dataStore.saveCommentByHostId({
        hostId: "host2",
        content: "New comment to delete",
        sessionId: "session1",
        commenter: {
          displayName: "Commenter 5",
        },
      });

      const deletedComment = await dataStore.deleteCommentById({
        id: commentToDelete.id,
        sessionId: "session1",
      });

      expect(deletedComment.id).toBe(commentToDelete.id);
      expect(deletedComment.hostid).toBe(commentToDelete.hostid);
      expect(deletedComment.content).toBe(commentToDelete.content);
    });

    it("should get a comment by identifier", async () => {
      const commentToGet = await dataStore.saveCommentByHostId({
        hostId: "host2",
        content: "New comment to get",
        sessionId: "session1",
        commenter: {
          displayName: "Commenter 6",
        },
      });

      const gottenComment = await dataStore.getCommentById({
        id: commentToGet.id,
      });

      expect(gottenComment.id).toBe(commentToGet.id);
      expect(gottenComment.hostid).toBe(commentToGet.hostid);
      expect(gottenComment.content).toBe(commentToGet.content);
    });

    describe(".consumer", async () => {
      const mockStoredConsumers: Consumer[] = [
        {
          id: "1",
          name: "Consumer 1",
          description: "Description for Consumer 1",
          apiKey: "f2ef9606-6e10-4530-a15c-594c2e3fcd73",
          apiSecret: "b5fe46d6-1efe-4988-bf2b-d5b0a90fbaaf",
          isActive: true,
          rateLimit: 100,
          allowedHosts: ["host1", "host2"],
        },
        {
          id: "2",
          name: "Consumer 2",
          description: "Description for Consumer 2",
          apiKey: "36a60d7f-cc80-4381-9f17-11dc96709233",
          apiSecret: "b5fe46d6-1efe-4988-bf2b-d5b0a90fbaaf",
          isActive: true,
          rateLimit: 100,
          allowedHosts: ["host3", "host4"],
        },
      ];

      beforeAll(async () => {
        await dataStore.consumer.save({ consumer: mockStoredConsumers[0] });
        await dataStore.consumer.save({ consumer: mockStoredConsumers[1] });
      });

      it("should get consumer details by consumer identifier", async () => {
        const consumer = await dataStore.consumer.getById({
          consumerId: "1",
        });

        expect(consumer.id).toBe(mockStoredConsumers[0].id);
        expect(consumer.name).toBe(mockStoredConsumers[0].name);
        expect(consumer.description).toBe(mockStoredConsumers[0].description);
      });

      it("should save a new consumer", async () => {
        const newConsumer: Consumer = {
          id: "3",
          name: "Consumer 3",
          description: "Description for Consumer 3",
          apiKey: "f2ef9606-6e10-4530-a15c-594c2e3fcd73",
          apiSecret: "b5fe46d6-1efe-4988-bf2b-d5b0a90fbaaf",
          isActive: true,
          rateLimit: 100,
          allowedHosts: ["host1", "host2"],
        };

        const savedConsumer = await dataStore.consumer.save({
          consumer: newConsumer,
        });

        expect(savedConsumer.id).toBe(newConsumer.id);
        expect(savedConsumer.name).toBe(newConsumer.name);
        expect(savedConsumer.description).toBe(newConsumer.description);
      });

      it("should update an existing consumer", async () => {
        const updatedConsumer: Consumer = {
          id: "1",
          name: "Updated Consumer 1",
          description: "Updated description for Consumer 1",
          apiKey: "36a60d7f-cc80-4381-9f17-11dc96709233",
          apiSecret: "b5fe46d6-1efe-4988-bf2b-d5b0a90fbaaf",
          isActive: true,
          rateLimit: 100,
          allowedHosts: ["host1", "host2"],
        };

        const savedConsumer = await dataStore.consumer.save({
          consumer: updatedConsumer,
        });

        expect(savedConsumer.id).toBe(updatedConsumer.id);
        expect(savedConsumer.name).toBe(updatedConsumer.name);
        expect(savedConsumer.description).toBe(updatedConsumer.description);
      });

      it("should delete a consumer by identifier", async () => {
        const consumerToDelete = await dataStore.consumer.getById({
          consumerId: "2",
        });

        const deletedConsumer = await dataStore.consumer.deleteById({
          consumerId: consumerToDelete.id,
        });

        expect(deletedConsumer.id).toBe(consumerToDelete.id);
        expect(deletedConsumer.name).toBe(consumerToDelete.name);
        expect(deletedConsumer.description).toBe(consumerToDelete.description);
      });
    });
  });
};

export { runDataStoreTests };
