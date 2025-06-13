import type { Pool, PoolClient, QueryConfig } from "pg";
import type { Comment } from "../../../app/domain/entities/comment.js";
import type { Config } from "../../../app/driven-ports/config.js";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";

type InnerRunInTransaction = (
  fn: (client: PoolClient) => Promise<unknown>,
) => Promise<unknown | void>;
type RunInTransaction = (pgPool: Pool) => InnerRunInTransaction;

type MigrateFn = ({
  pgPool,
  targetMigration,
}: {
  pgPool: Pool;
  targetMigration?: string; // Optional: migrate up to specific migration
}) => Promise<unknown | void>;

type RollbackFn = ({
  pgPool,
  targetMigration,
}: {
  pgPool: Pool;
  targetMigration?: string; // Optional: rollback to specific migration
}) => Promise<unknown | void>;

type GetMigrationStatusFn = ({ pgPool }: { pgPool: Pool }) => Promise<
  Array<{
    id: string;
    name: string;
    applied: boolean;
  }>
>;

type GetPgPool = ({
  config,
  secretStore,
}: {
  config: Config["dataStore"];
  secretStore: SecretStore;
}) => Pool;

// * Data Store Queries

type GetAllCommentsByHostIdQuery = ({
  hostId,
}: {
  hostId: Comment["hostId"];
}) => QueryConfig;
type SaveCommentByHostIdQuery = ({
  id,
  hostId,
  content,
  sessionId,
  commenter,
}: {
  id: Comment["id"];
  hostId: Comment["hostId"];
  content: Comment["content"];
  sessionId: Comment["sessionId"];
  commenter: Comment["commenter"];
}) => QueryConfig;
type UpdateCommentByIdQuery = ({
  id,
  content,
  sessionId,
}: {
  id: Comment["id"];
  content: Comment["content"];
  sessionId: Comment["sessionId"];
}) => QueryConfig;
type DeleteCommentByIdQuery = ({
  id,
  sessionId,
}: {
  id: Comment["id"];
  sessionId: Comment["sessionId"];
}) => QueryConfig;
type GetCommentByIdQuery = ({ id }: { id: Comment["id"] }) => QueryConfig;

export type {
  RunInTransaction,
  MigrateFn,
  RollbackFn,
  GetMigrationStatusFn,
  GetPgPool,
  GetAllCommentsByHostIdQuery,
  SaveCommentByHostIdQuery,
  UpdateCommentByIdQuery,
  DeleteCommentByIdQuery,
  GetCommentByIdQuery,
};
