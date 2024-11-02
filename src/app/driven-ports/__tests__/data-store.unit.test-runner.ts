import { beforeAll, describe, expect, it } from "vitest";
import type { Comment } from "../../domain/entities/comment.js";
import type { DataStore } from "../data-store.js";

const mockComments: Comment[] = [
  {
    id: "1",
    hostId: "host1",
    content: "First comment",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    hostId: "host1",
    content: "Second comment",
    createdAt: new Date(),
    updatedAt: new Date(),
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
    });

    await dataStore.saveCommentByHostId({
      hostId: "host1",
      content: "Second comment",
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
      });

      expect(savedComment.id).toBeTypeOf("string");
      expect(savedComment.hostid).toBe(mockComment.hostId);
      expect(savedComment.content).toBe(mockComment.content);
    });

    it("should update a comment by identifier", async () => {
      const commentToUpdate = await dataStore.saveCommentByHostId({
        hostId: "host2",
        content: "New comment to update",
      });

      const updatedComment = await dataStore.updateCommentById({
        id: commentToUpdate.id,
        content: "Updated comment",
      });

      expect(updatedComment.id).toBe(commentToUpdate.id);
      expect(updatedComment.hostid).toBe(commentToUpdate.hostid);
      expect(updatedComment.content).toBe("Updated comment");
    });

    it("should delete a comment by identifier", async () => {
      const commentToDelete = await dataStore.saveCommentByHostId({
        hostId: "host2",
        content: "New comment to delete",
      });

      const deletedComment = await dataStore.deleteCommentById({
        id: commentToDelete.id,
      });

      expect(deletedComment.id).toBe(commentToDelete.id);
      expect(deletedComment.hostid).toBe(commentToDelete.hostid);
      expect(deletedComment.content).toBe(commentToDelete.content);
    });

    it("should get a comment by identifier", async () => {
      const commentToGet = await dataStore.saveCommentByHostId({
        hostId: "host2",
        content: "New comment to get",
      });

      const gottenComment = await dataStore.getCommentById({
        id: commentToGet.id,
      });

      expect(gottenComment.id).toBe(commentToGet.id);
      expect(gottenComment.hostid).toBe(commentToGet.hostid);
      expect(gottenComment.content).toBe(commentToGet.content);
    });
  });
};

export { runDataStoreTests };
