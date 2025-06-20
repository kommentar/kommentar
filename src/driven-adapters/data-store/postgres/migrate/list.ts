import type { Migration } from "./types.js";

const migrations: Array<Migration> = [
  {
    id: "001",
    name: "create-schema-kommentar",
    up: {
      name: "create-schema-kommentar",
      text: `
        CREATE SCHEMA IF NOT EXISTS kommentar;
      `,
    },
    down: {
      name: "drop-schema-kommentar",
      text: "DROP SCHEMA IF EXISTS kommentar CASCADE;",
    },
  },
  {
    id: "002",
    name: "create-table-comments",
    up: {
      name: "create-table-comments",
      text: `
        CREATE TABLE IF NOT EXISTS kommentar.comments (
          id uuid PRIMARY KEY,
          content text NOT NULL,
          host_id varchar(255) NOT NULL,
          created_at timestamp NOT NULL,
          updated_at timestamp NOT NULL
        );
      `,
    },
    down: {
      name: "drop-table-comments",
      text: "DROP TABLE IF EXISTS kommentar.comments;",
    },
  },
  {
    id: "003",
    name: "create-comments-index-host_id",
    up: {
      name: "create-comments-index-host_id",
      text: `
        CREATE INDEX IF NOT EXISTS comments_host_id_idx ON kommentar.comments (host_id);
      `,
    },
    down: {
      name: "drop-comments-index-host_id",
      text: `
        DROP INDEX IF EXISTS comments_host_id_idx;
      `,
    },
  },
  {
    id: "004",
    name: "create-comments-index-created_at",
    up: {
      name: "create-comments-index-created_at",
      text: `
        CREATE INDEX IF NOT EXISTS comments_created_at_idx ON kommentar.comments (created_at);
      `,
    },
    down: {
      name: "drop-comments-index-created_at",
      text: `
        DROP INDEX IF EXISTS comments_created_at_idx;
      `,
    },
  },
  {
    id: "005",
    name: "add-session-id-column",
    up: {
      name: "add-session-id-column",
      text: `
        ALTER TABLE kommentar.comments
        ADD COLUMN IF NOT EXISTS session_id uuid NOT NULL;
      `,
    },
    down: {
      name: "remove-session-id-column",
      text: `
        ALTER TABLE kommentar.comments DROP COLUMN IF EXISTS session_id;
      `,
    },
  },
  {
    id: "006",
    name: "add-session-id-column-index",
    up: {
      name: "add-session-id-column-index",
      text: `
        CREATE INDEX IF NOT EXISTS comments_session_id_idx ON kommentar.comments (session_id);
      `,
    },
    down: {
      name: "remove-session-id-column-index",
      text: `
        DROP INDEX IF EXISTS comments_session_id_idx;
      `,
    },
  },
  {
    id: "007",
    name: "add-commenter-columns",
    up: {
      name: "add-commenter-columns",
      text: `
        ALTER TABLE kommentar.comments
        ADD COLUMN IF NOT EXISTS commenter_display_name text NOT NULL,
        ADD COLUMN IF NOT EXISTS commenter_real_name text NOT NULL DEFAULT '';
      `,
    },
    down: {
      name: "remove-commenter-columns",
      text: `
        ALTER TABLE kommentar.comments
        DROP COLUMN IF EXISTS commenter_display_name,
        DROP COLUMN IF EXISTS commenter_real_name;
      `,
    },
  },
  {
    id: "008",
    name: "create-consumer-table",
    up: {
      name: "create-consumer-table",
      text: `
        CREATE TABLE IF NOT EXISTS kommentar.consumer (
          id uuid PRIMARY KEY,
          name varchar(255) NOT NULL,
          description text NOT NULL,
          created_at timestamp NOT NULL,
          updated_at timestamp NOT NULL
        );
      `,
    },
    down: {
      name: "drop-consumer-table",
      text: "DROP TABLE IF EXISTS kommentar.consumer;",
    },
  },
  {
    id: "009",
    name: "create-consumer-index-id",
    up: {
      name: "create-consumer-index-id",
      text: `
        CREATE INDEX IF NOT EXISTS consumer_id_idx ON kommentar.consumer (id);
      `,
    },
    down: {
      name: "drop-consumer-index-id",
      text: `
        DROP INDEX IF EXISTS consumer_id_idx;
      `,
    },
  },
  {
    id: "010",
    name: "add-consumer-api-columns",
    up: {
      name: "add-consumer-api-columns",
      text: `
        ALTER TABLE kommentar.consumer
        ADD COLUMN IF NOT EXISTS api_key varchar(255) NOT NULL,
        ADD COLUMN IF NOT EXISTS api_secret varchar(255) NOT NULL,
        ADD COLUMN IF NOT EXISTS allowed_hosts text NOT NULL,
        ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL,
        ADD COLUMN IF NOT EXISTS rate_limit integer NOT NULL;
      `,
    },
    down: {
      name: "remove-consumer-api-columns",
      text: `
        ALTER TABLE kommentar.consumer
        DROP COLUMN IF EXISTS api_key,
        DROP COLUMN IF EXISTS api_secret,
        DROP COLUMN IF EXISTS allowed_hosts,
        DROP COLUMN IF EXISTS is_active,
        DROP COLUMN IF EXISTS rate_limit;
      `,
    },
  },
  {
    id: "011",
    name: "add-consumer-api-indexes",
    up: {
      name: "add-consumer-api-indexes",
      text: `
        CREATE UNIQUE INDEX IF NOT EXISTS consumer_api_key_idx ON kommentar.consumer (api_key);
      `,
    },
    down: {
      name: "remove-consumer-api-indexes",
      text: `
        DROP INDEX IF EXISTS consumer_api_key_idx;
      `,
    },
  },
  {
    id: "012",
    name: "add-consumer-active-index",
    up: {
      name: "add-consumer-active-index",
      text: `
        CREATE INDEX IF NOT EXISTS consumer_active_idx ON kommentar.consumer (is_active);
      `,
    },
    down: {
      name: "remove-consumer-active-index",
      text: `
        DROP INDEX IF EXISTS consumer_active_idx;
      `,
    },
  },
];

export { migrations };
