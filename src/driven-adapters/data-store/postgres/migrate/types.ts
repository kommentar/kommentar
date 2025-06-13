import type { PoolClient, QueryConfig } from "pg";

type MigrationRecord = {
  id: string;
  name: string;
  applied_at: string;
};

type Migration = {
  id: string;
  name: string;
  up: QueryConfig;
  down?: QueryConfig; // Optional rollback query
};

type CreateMigrationsTableIfNotPresent = (client: PoolClient) => Promise<void>;
type GetAppliedMigrations = (client: PoolClient) => Promise<string[]>;
type RecordMigration = (
  client: PoolClient,
  migration: Migration,
) => Promise<void>;
type RemoveMigrationRecord = (
  client: PoolClient,
  migrationId: string,
) => Promise<void>;

export type {
  MigrationRecord,
  Migration,
  CreateMigrationsTableIfNotPresent,
  GetAppliedMigrations,
  RecordMigration,
  RemoveMigrationRecord,
};
