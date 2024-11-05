import type { Pool, QueryConfig } from "pg";

type Queries = { [key: string]: QueryConfig };
type Migrate = ({ pgPool }: { pgPool: Pool }) => Promise<void>;

const queries: Queries = {
  createTableComments: {
    name: "create-table-comments",
    text: `
      CREATE TABLE IF NOT EXISTS comments (
        id uuid PRIMARY KEY,
        content text NOT NULL,
        hostId varchar(255) NOT NULL,
        createdAt timestamp NOT NULL,
        updatedAt timestamp NOT NULL
      );
    `,
  },
  createTableCommentsIndexHostId: {
    name: "create-table-comments-index-host-id",
    text: `
      CREATE INDEX IF NOT EXISTS comments_host_id_idx ON comments (hostId);
    `,
  },
  createTableCommentsIndexCreatedAt: {
    name: "create-table-comments-index-created-at",
    text: `
      CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments (createdAt);
    `,
  },
  addSessionIdColumn: {
    name: "add-session-id-column",
    text: `
      ALTER TABLE comments
      ADD COLUMN IF NOT EXISTS sessionId uuid NOT NULL;
    `,
  },
};

const migrate: Migrate = async ({ pgPool }) => {
  const client = await pgPool.connect();

  try {
    console.debug("Starting database migration", queries);

    await client.query("BEGIN");
    await client.query(queries.createTableComments);
    await client.query(queries.createTableCommentsIndexHostId);
    await client.query(queries.createTableCommentsIndexCreatedAt);
    await client.query(queries.addSessionIdColumn);
    await client.query("COMMIT");

    console.debug("Database migration completed");
  } catch (error) {
    console.error("Database migration failed, rolling back.");

    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export { migrate };
