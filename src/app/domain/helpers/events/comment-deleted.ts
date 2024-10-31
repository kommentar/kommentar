import type { CloudEvent } from "../../../driven-ports/event-broker.js";
import type { RandomId } from "../../../driven-ports/random-id.js";
import type { Comment } from "../../entities/comment.js";

type ToCommentDeletedEvent = ({
  deletedCommentId,
  subject,
  source,
  randomId,
}: {
  deletedCommentId: Comment["id"];
  subject: string;
  source: string;
  randomId: RandomId;
}) => CloudEvent;

const toCommentDeletedEvent: ToCommentDeletedEvent = ({
  deletedCommentId,
  subject,
  source,
  randomId,
}) => {
  return {
    specversion: "1.0",
    type: "kommentar.comment.deleted",
    source,
    datacontenttype: "application/json",
    data: { id: deletedCommentId },
    id: randomId.generate(),
    subject,
    time: new Date().toISOString(),
  };
};

export type { ToCommentDeletedEvent };
export { toCommentDeletedEvent };
