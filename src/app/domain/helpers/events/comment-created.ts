import type { CloudEvent } from "../../../driven-ports/event-broker.js";
import type { PublicComment } from "../../entities/comment.js";
import type { RandomId } from "../../../driven-ports/random-id.js";

type ToCommentCreatedEvent = ({
  comment,
  subject,
  source,
  randomId,
}: {
  comment: PublicComment;
  subject: string;
  source: string;
  randomId: RandomId;
}) => CloudEvent;

const toCommentCreatedEvent: ToCommentCreatedEvent = ({
  comment,
  subject,
  source,
  randomId,
}) => {
  return {
    specversion: "1.0",
    type: "kommentar.comment.created",
    source,
    datacontenttype: "application/json",
    data: comment,
    id: randomId.generate(),
    subject,
    time: new Date().toISOString(),
  };
};

export type { ToCommentCreatedEvent };
export { toCommentCreatedEvent };
