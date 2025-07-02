import type { Comment, PublicComment } from "../../entities/comment.js";
import type { Consumer, PublicConsumer } from "../../entities/consumer.js";
import type {
  StoredComment,
  StoredConsumer,
} from "../../../driven-ports/data-store.js";

type ToPublicComment = (storedComment: StoredComment) => PublicComment;
type ToComment = (storedComment: StoredComment) => Comment;
type ToPublicConsumer = (storedConsumer: StoredConsumer) => PublicConsumer;
type ToConsumer = (storedConsumer: StoredConsumer) => Consumer;

const toPublicComment: ToPublicComment = (storedComment) => ({
  id: storedComment.id,
  content: storedComment.content,
  hostId: storedComment.host_id,
  createdAt: storedComment.created_at,
  updatedAt: storedComment.updated_at,
  commenter: {
    displayName: storedComment.commenter_display_name,
    realName: storedComment.commenter_real_name,
  },
});

const toComment: ToComment = (storedComment) => ({
  id: storedComment.id,
  content: storedComment.content,
  hostId: storedComment.host_id,
  createdAt: storedComment.created_at,
  updatedAt: storedComment.updated_at,
  sessionId: storedComment.session_id,
  commenter: {
    displayName: storedComment.commenter_display_name,
    realName: storedComment.commenter_real_name,
  },
});

const toPublicConsumer: ToPublicConsumer = (storedConsumer) => ({
  id: storedConsumer.id,
  name: storedConsumer.name,
  description: storedConsumer.description,
  allowedHosts: JSON.parse(storedConsumer.allowed_hosts) ?? [],
  apiKey: storedConsumer.api_key,
  isActive: storedConsumer.is_active,
  rateLimit: storedConsumer.rate_limit,
});

const toConsumer: ToConsumer = (storedConsumer) => ({
  id: storedConsumer.id,
  name: storedConsumer.name,
  description: storedConsumer.description,
  allowedHosts: JSON.parse(storedConsumer.allowed_hosts) ?? [],
  apiKey: storedConsumer.api_key,
  apiSecret: storedConsumer.api_secret,
  isActive: storedConsumer.is_active,
  rateLimit: storedConsumer.rate_limit,
});

export { toPublicComment, toComment, toPublicConsumer, toConsumer };
