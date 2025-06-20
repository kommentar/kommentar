import type { PublicComment } from "../entities/comment.js";
import type { CacheStore } from "../../driven-ports/cache-store.js";
import type { EventBroker } from "../../driven-ports/event-broker.js";

type WheneverCommentUpdatedInvalidateCachePolicy = ({
  eventBroker,
  cacheStore,
}: {
  eventBroker: EventBroker;
  cacheStore: CacheStore;
}) => void;

const wheneverCommentUpdatedInvalidateCache: WheneverCommentUpdatedInvalidateCachePolicy =
  ({ eventBroker, cacheStore }) => {
    eventBroker.subscribe({
      type: "kommentar.comment.updated",
      handler: (event) => {
        const updatedComment = event.data as PublicComment;
        const { hostId: key } = updatedComment;

        const currentCachedComments = cacheStore.get(key) as
          | PublicComment[]
          | undefined;

        if (!currentCachedComments) {
          cacheStore.set(key, [updatedComment]);
        } else {
          const updatedCachedComments = currentCachedComments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment,
          );

          cacheStore.set(key, updatedCachedComments);
        }
      },
    });
  };

export { wheneverCommentUpdatedInvalidateCache };
