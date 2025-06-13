import type {
  CreateMigrationsTableIfNotPresent,
  GetAppliedMigrations,
  MigrationRecord,
  RecordMigration,
  RemoveMigrationRecord,
} from "./types.js";

const createMigrationsTableIfNotPresent: CreateMigrationsTableIfNotPresent =
  async (client) => {
    await client.query(`
    CREATE TABLE IF NOT EXISTS kommentar_schema_migrations (
      id varchar(255) PRIMARY KEY,
      name varchar(255) NOT NULL,
      applied_at timestamp NOT NULL DEFAULT NOW()
    );
  `);
  };

const getAppliedMigrations: GetAppliedMigrations = async (client) => {
  const result = await client.query(
    "SELECT id FROM kommentar_schema_migrations ORDER BY applied_at ASC",
  );
  return result.rows.map((row: MigrationRecord) => row.id);
};

const recordMigration: RecordMigration = async (client, migration) => {
  await client.query(
    "INSERT INTO kommentar_schema_migrations (id, name) VALUES ($1, $2)",
    [migration.id, migration.name],
  );
};

const removeMigrationRecord: RemoveMigrationRecord = async (
  client,
  migrationId,
) => {
  await client.query("DELETE FROM kommentar_schema_migrations WHERE id = $1", [
    migrationId,
  ]);
};

export {
  createMigrationsTableIfNotPresent,
  getAppliedMigrations,
  recordMigration,
  removeMigrationRecord,
};
