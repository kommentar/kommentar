import type { GetMigrationStatusFn, MigrateFn, RollbackFn } from "../types.js";
import type { Migration, MigrationRecord } from "./types.js";
import type { PoolClient } from "pg";
import { errors } from "../../../../app/domain/entities/error.js";
import { migrations } from "./list.js";
import { runInTransaction } from "../utils.js";

const createMigrationsTableIfNotPresent = async (client: PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS kommentar_schema_migrations (
      id varchar(255) PRIMARY KEY,
      name varchar(255) NOT NULL,
      applied_at timestamp NOT NULL DEFAULT NOW()
    );
  `);
};

const getAppliedMigrations = async (client: PoolClient): Promise<string[]> => {
  const result = await client.query(
    "SELECT id FROM kommentar_schema_migrations ORDER BY applied_at ASC",
  );
  return result.rows.map((row: MigrationRecord) => row.id);
};

const recordMigration = async (client: PoolClient, migration: Migration) => {
  await client.query(
    "INSERT INTO kommentar_schema_migrations (id, name) VALUES ($1, $2)",
    [migration.id, migration.name],
  );
};

const removeMigrationRecord = async (
  client: PoolClient,
  migrationId: string,
) => {
  await client.query("DELETE FROM kommentar_schema_migrations WHERE id = $1", [
    migrationId,
  ]);
};

const migrate: MigrateFn = async ({ pgPool, targetMigration }) => {
  console.debug("Starting database migration");

  return runInTransaction(pgPool)(async (client) => {
    await createMigrationsTableIfNotPresent(client);

    const appliedMigrations = await getAppliedMigrations(client);

    // Find migrations that need to be applied
    const pendingMigrations = migrations.filter(
      (migration) => !appliedMigrations.includes(migration.id),
    );

    // If targetMigration is specified, only migrate up to that point
    const migrationsToApply = targetMigration
      ? pendingMigrations.filter((migration) => migration.id <= targetMigration)
      : pendingMigrations;

    if (migrationsToApply.length === 0) {
      console.debug("No pending migrations");
      return;
    }

    console.debug(`Applying ${migrationsToApply.length} migrations`);

    // Apply each pending migration
    for (const migration of migrationsToApply) {
      console.debug(`Applying migration ${migration.id}: ${migration.name}`);

      await client.query(migration.up);
      await recordMigration(client, migration);

      console.debug(`✓ Applied migration ${migration.id}`);
    }

    console.debug("Database migration completed successfully");
  });
};

const rollback: RollbackFn = async ({ pgPool, targetMigration }) => {
  console.debug("Starting database rollback");

  return runInTransaction(pgPool)(async (client) => {
    await createMigrationsTableIfNotPresent(client);

    const appliedMigrations = await getAppliedMigrations(client);

    // Find migrations to rollback (in reverse order)
    const migrationsToRollback = migrations
      .filter((migration) => appliedMigrations.includes(migration.id))
      .reverse();

    // If targetMigration specified, only rollback to that point, else rollback the last one
    const migrationsToApply = targetMigration
      ? migrationsToRollback.filter(
          (migration) => migration.id > targetMigration,
        )
      : [migrationsToRollback[0]];

    if (migrationsToApply.length === 0) {
      console.debug("No migrations to rollback");
      return;
    }

    for (const migration of migrationsToApply) {
      if (!migration.down) {
        throw errors.dependency.dataStoreError;
      }

      console.debug(
        `Rolling back migration ${migration.id}: ${migration.name}`,
      );

      await client.query(migration.down);
      await removeMigrationRecord(client, migration.id);

      console.debug(`✓ Rolled back migration ${migration.id}`);
    }

    console.debug("Database rollback completed successfully");
  });
};

const getMigrationStatus: GetMigrationStatusFn = async ({ pgPool }) => {
  const client = await pgPool.connect();

  try {
    await createMigrationsTableIfNotPresent(client);
    const appliedMigrations = await getAppliedMigrations(client);

    const status = migrations.map((migration) => ({
      id: migration.id,
      name: migration.name,
      applied: appliedMigrations.includes(migration.id),
    }));

    return status;
  } finally {
    client.release();
  }
};

export { migrate, rollback, getMigrationStatus };
