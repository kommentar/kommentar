import type { CacheStore } from "../../driven-ports/cache-store.js";
import type { EventBroker } from "../../driven-ports/event-broker.js";
import type { PublicComment } from "../entities/comment.js";

type WheneverCommentCreatedInvalidateCachePolicy = ({
  eventBroker,
  cacheStore,
}: {
  eventBroker: EventBroker;
  cacheStore: CacheStore;
}) => void;

const wheneverCommentCreatedInvalidateCache: WheneverCommentCreatedInvalidateCachePolicy =
  ({ eventBroker, cacheStore }) => {
    eventBroker.subscribe({
      type: "kommentar.comment.created",
      handler: (event) => {
        const key = event.subject;

        const currentCachedComments = cacheStore.get(key) as
          | PublicComment[]
          | undefined;

        const newComment = event.data as PublicComment;

        if (!currentCachedComments) {
          cacheStore.set(key, [newComment]);
        } else {
          cacheStore.set(key, [...currentCachedComments, newComment]);
        }
      },
    });
  };

export { wheneverCommentCreatedInvalidateCache };
