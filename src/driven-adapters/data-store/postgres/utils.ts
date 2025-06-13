import type { RunInTransaction } from "./types.js";

const runInTransaction: RunInTransaction = (pgPool) => async (fn) => {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      // Log rollback failure but don't change the flow
      console.error("Rollback failed:", rollbackError);
    }
    throw error;
  } finally {
    client.release();
  }
};

export { runInTransaction };
