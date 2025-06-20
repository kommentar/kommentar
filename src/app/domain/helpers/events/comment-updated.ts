import type { CloudEvent } from "../../../driven-ports/event-broker.js";
import type { RandomId } from "../../../driven-ports/random-id.js";
import type { PublicComment } from "../../entities/comment.js";

type ToCommentUpdatedEvent = ({
  updatedComment,
  subject,
  source,
  randomId,
}: {
  updatedComment: PublicComment;
  subject: string;
  source: string;
  randomId: RandomId;
}) => CloudEvent;

const toCommentUpdatedEvent: ToCommentUpdatedEvent = ({
  updatedComment,
  subject,
  source,
  randomId,
}) => {
  return {
    specversion: "1.0",
    type: "kommentar.comment.updated",
    source,
    datacontenttype: "application/json",
    data: updatedComment,
    id: randomId.generate(),
    subject,
    time: new Date().toISOString(),
  };
};

export type { ToCommentUpdatedEvent };
export { toCommentUpdatedEvent };
