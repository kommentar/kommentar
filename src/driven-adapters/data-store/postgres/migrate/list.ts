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
          hostId varchar(255) NOT NULL,
          createdAt timestamp NOT NULL,
          updatedAt timestamp NOT NULL
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
        CREATE INDEX IF NOT EXISTS comments_host_id_idx ON kommentar.comments (hostId);
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
        CREATE INDEX IF NOT EXISTS comments_created_at_idx ON kommentar.comments (createdAt);
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
        ADD COLUMN IF NOT EXISTS sessionId uuid NOT NULL;
      `,
    },
    down: {
      name: "remove-session-id-column",
      text: `
        ALTER TABLE kommentar.comments DROP COLUMN IF EXISTS sessionId;
      `,
    },
  },
  {
    id: "006",
    name: "add-session-id-column-index",
    up: {
      name: "add-session-id-column-index",
      text: `
        CREATE INDEX IF NOT EXISTS comments_session_id_idx ON kommentar.comments (sessionId);
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
        ADD COLUMN IF NOT EXISTS commenter_displayname text NOT NULL DEFAULT 'Anonymous',
        ADD COLUMN IF NOT EXISTS commenter_realname text;
      `,
    },
    down: {
      name: "remove-commenter-columns",
      text: `
        ALTER TABLE kommentar.comments
        DROP COLUMN IF EXISTS commenter_displayname,
        DROP COLUMN IF EXISTS commenter_realname;
      `,
    },
  },
];

export { migrations };
